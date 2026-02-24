import React, { useCallback, useMemo } from 'react';
import {
	Dimensions,
	Linking,
	Pressable,
	RefreshControl,
	StyleSheet,
	View,
} from 'react-native';
import { CircleFade, Flow } from 'react-native-animated-spinkit';
import BackButton from '@/components/atoms/common/BackButton/BackButton';
import Header from '@/components/atoms/common/Header/Header';
import Underline from '@/components/atoms/common/Underline/Underline';
import FFAccountListItem from '@/components/organisms/profile/FFAccountListItem/FFAccountListItem';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import {
	useCheckRelationships,
	useFollowingAccountsQuery,
} from '@/hooks/queries/profile.queries';
import { useSelectedDomain } from '@/store/feed/activeDomain';
import customColor from '@/util/constant/color';
import { flattenPages } from '@/util/helper/timeline';
import { FlashList } from '@shopify/flash-list';
import AccountListEmpty from '@/components/atoms/profile/AccountListEmpty/AccountListEmpty';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '@/types/navigation';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { getDomainFromAccHandle } from '@/util/helper/helper';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';

type FollowingAccountsScreenRouteProp = RouteProp<
	HomeStackParamList,
	'FollowingAccounts'
>;

const FollowingAccounts = ({
	route,
}: {
	route: FollowingAccountsScreenRouteProp;
}) => {
	const { colorScheme } = useColorScheme();
	const { accountId, isMainChannel, isUserFromSameServer, userAccHandle } =
		route.params;
	const domain_name = useSelectedDomain();
	const { userName, domain: userOwnDomain } =
		getDomainFromAccHandle(userAccHandle);
	const { t } = useTranslation();

	const {
		data,
		isFetching,
		hasNextPage,
		fetchNextPage,
		refetch,
		isLoading: isFollowListLoading,
	} = useFollowingAccountsQuery({
		accountId: accountId,
		domain_name: isMainChannel ? process.env.API_URL! : domain_name,
	});

	const followerIds = useMemo(() => {
		return data ? flattenPages(data).map(follower => follower.id) : [];
	}, [data]);

	const {
		data: relationships,
		isLoading: isLoadingRelationships,
		refetch: refetchRelationships,
	} = useCheckRelationships({
		accountIds: followerIds,
	});

	const relationshipsMap = useMemo(() => {
		if (!relationships) return new Map();
		return new Map(relationships?.map(rel => [rel.id, rel]));
	}, [relationships, refetchRelationships]);

	const renderItem = useCallback(
		({ item }: { item: Patchwork.Account }) => (
			<FFAccountListItem
				item={item}
				relationship={relationshipsMap.get(item.id)}
				isLoadingRelationships={isLoadingRelationships}
				isMainChannel={isMainChannel}
				followerIds={followerIds}
			/>
		),
		[relationshipsMap],
	);

	const handleFetchNextPage = () => {
		if (hasNextPage) {
			return fetchNextPage();
		}
	};

	return (
		<SafeScreen>
			<Header
				title={t('screen.following')}
				leftCustomComponent={<BackButton />}
				hideUnderline
			/>
			<Underline />
			{data ? (
				<FlashList
					data={flattenPages(data)}
					renderItem={renderItem}
					ItemSeparatorComponent={Underline}
					ListEmptyComponent={<AccountListEmpty />}
					onEndReachedThreshold={0.15}
					onEndReached={handleFetchNextPage}
					refreshControl={
						<RefreshControl
							refreshing={isFetching}
							tintColor={colorScheme == 'dark' ? 'white' : 'black'}
							onRefresh={() => {
								refetch();
								refetchRelationships();
							}}
						/>
					}
					ListFooterComponent={
						isFetching ? (
							<View className="my-3 items-center">
								<CircleFade
									size={25}
									color={colorScheme === 'dark' ? '#fff' : '#000'}
								/>
							</View>
						) : (
							<></>
						)
					}
					getItemType={item => {
						return item.id;
					}}
				/>
			) : (
				<View className="flex-1 items-center justify-center">
					<Flow
						size={50}
						color={
							colorScheme === 'dark'
								? customColor['patchwork-primary-dark']
								: customColor['patchwork-primary']
						}
					/>
				</View>
			)}
			{!isFollowListLoading && !isUserFromSameServer && (
				<>
					<ThemeText className="text-center pb-0 pt-2 text-slate-600 dark:text-slate-300">
						Follows from this profile may be missing.
					</ThemeText>
					<Pressable
						onPress={() => {
							Linking.openURL(`https://${userOwnDomain}/@${userName}`);
						}}
						className="active:opacity-70"
					>
						<ThemeText
							size={'sm_14'}
							className="text-center pb-3 text-patchwork-primary"
						>
							See more follows on {userOwnDomain}
						</ThemeText>
					</Pressable>
				</>
			)}
		</SafeScreen>
	);
};

export default FollowingAccounts;
