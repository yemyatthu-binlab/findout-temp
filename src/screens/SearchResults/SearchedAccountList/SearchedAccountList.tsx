import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { CircleFade, Flow } from 'react-native-animated-spinkit';
import BackButton from '@/components/atoms/common/BackButton/BackButton';
import Header from '@/components/atoms/common/Header/Header';
import SearchedAccountListItem from '@/components/organisms/search/SearchedAccountListItem/SearchedAccountListItem';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import { useSearchAccountsInfiniteQuery } from '@/hooks/queries/hashtag.queries';
import { useCheckRelationships } from '@/hooks/queries/profile.queries';
import { SearchStackScreenProps } from '@/types/navigation';
import customColor from '@/util/constant/color';
import { FlashList } from '@shopify/flash-list';
import { useFocusEffect } from '@react-navigation/native';
import { queryClient } from '@/App';
import { CheckRelationshipQueryKey } from '@/types/queries/profile.type';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';

const SearchedAccountList = ({
	navigation,
	route,
}: SearchStackScreenProps<'SearchedAccountList'>) => {
	const { q } = route.params;
	const { t } = useTranslation();
	const { colorScheme } = useColorScheme();
	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useSearchAccountsInfiniteQuery({ q });

	const accounts = data?.pages?.flatMap(page => page.accounts) || [];
	const accountIds = accounts?.map(people => people.id) || [];

	// ***** Check Relationship To Other Accounts ***** //
	const { data: relationships, isLoading: isRelationshipInvalidating } =
		useCheckRelationships({
			accountIds: accountIds,
			options: {
				enabled: accountIds.length > 0,
			},
		});
	// ***** Check Relationship To Other Accounts ***** //

	const relationshipsMap = useMemo(() => {
		if (!relationships) return new Map();
		return new Map(relationships?.map(rel => [rel.id, rel]));
	}, [relationships, data]);

	const renderItem = useCallback(
		({ item }: { item: Patchwork.Account }) => (
			<SearchedAccountListItem
				item={item}
				relationship={relationshipsMap.get(item.id)}
				accountIds={accountIds}
				q={q}
				isRelationshipInvalidating={isRelationshipInvalidating}
			/>
		),
		[relationshipsMap, isRelationshipInvalidating],
	);

	const relationshipQueryKey: CheckRelationshipQueryKey = [
		'check-relationship-to-other-accounts',
		{ accountIds: accountIds },
	];

	useFocusEffect(
		useCallback(() => {
			queryClient.invalidateQueries({ queryKey: relationshipQueryKey });
		}, []),
	);

	return (
		<SafeScreen>
			<View className="flex-1">
				<Header
					title={t('common.people')}
					leftCustomComponent={<BackButton />}
					underlineClassName="mb-0"
				/>

				{isLoading ? (
					<View className="flex-1 justify-center items-center">
						<Flow
							size={50}
							color={
								colorScheme === 'dark'
									? customColor['patchwork-primary-dark']
									: customColor['patchwork-primary']
							}
						/>
					</View>
				) : (
					<FlashList
						data={accounts}
						renderItem={renderItem}
						keyExtractor={item => item.id.toString()}
						onEndReachedThreshold={0.5}
						onEndReached={() => {
							if (hasNextPage && !isFetchingNextPage) {
								fetchNextPage();
							}
						}}
						ListFooterComponent={
							<View className="items-center my-5">
								{isFetchingNextPage ? (
									<CircleFade
										size={25}
										color={colorScheme === 'dark' ? '#fff' : '#000'}
									/>
								) : (
									<></>
								)}
							</View>
						}
						showsVerticalScrollIndicator={false}
					/>
				)}
			</View>
		</SafeScreen>
	);
};

export default SearchedAccountList;
