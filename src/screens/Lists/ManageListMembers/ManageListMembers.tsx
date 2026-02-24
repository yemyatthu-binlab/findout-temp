import { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Flow } from 'react-native-animated-spinkit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '@/components/atoms/common/BackButton/BackButton';
import { Button } from '@/components/atoms/common/Button/Button';
import Header from '@/components/atoms/common/Header/Header';
import ListEmptyComponent from '@/components/atoms/common/ListEmptyComponent/ListEmptyComponent';
import TextInput from '@/components/atoms/common/TextInput/TextInput';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import Underline from '@/components/atoms/common/Underline/Underline';
import ListMembersItem from '@/components/organisms/lists/ListMembersItem';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import useDebounce from '@/hooks/custom/useDebounce';
import { useSearchUsers } from '@/hooks/queries/conversations.queries';
import { useListMembersQuery } from '@/hooks/queries/lists.queries';
import { useCheckRelationships } from '@/hooks/queries/profile.queries';
import { ListsStackScreenProps } from '@/types/navigation';
import customColor from '@/util/constant/color';
import { SearchIcon } from '@/util/svg/icon.common';
import { FlashList } from '@shopify/flash-list';
import { cn } from '@/util/helper/twutil';
import { isTablet } from '@/util/helper/isTablet';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';

const ManageListMembers = ({
	navigation,
	route,
}: ListsStackScreenProps<'ManageListMembers'>) => {
	const { listId, listTimelinesTitle, isEditMember } = route.params;
	const { colorScheme } = useColorScheme();
	const { t } = useTranslation();
	const { bottom } = useSafeAreaInsets();

	const [searchKeyword, setSearchKeyword] = useState('');
	const [finalKeyword, setFinalKeyword] = useState('');
	const [accountIds, setAccountIds] = useState<string[]>([]);
	const startDebounce = useDebounce();

	useEffect(() => {
		startDebounce(() => setFinalKeyword(searchKeyword), 500);
	}, [searchKeyword]);

	const { data: searchedUsers } = useSearchUsers({
		q: finalKeyword,
		resolve: true,
		options: { enabled: finalKeyword.length > 1 },
	});

	const { data: listMembers, isLoading: isListMembersLoading } =
		useListMembersQuery({
			id: listId,
			options: {
				enabled: !!listId,
			},
		});

	const members = useMemo(
		() => searchedUsers?.data || listMembers || [],
		[searchedUsers?.data, listMembers],
	);
	const memberIds = useMemo(() => members.map(member => member.id), [members]);

	// ***** Check Relationship To Other Accounts ***** //
	const { data: relationships } = useCheckRelationships({
		accountIds: memberIds,
		options: {
			enabled: memberIds.length > 0,
		},
	});
	// ***** Check Relationship To Other Accounts ***** //

	const relationshipsMap = useMemo(() => {
		if (!relationships) return new Map();
		return new Map(relationships?.map(rel => [rel.id, rel]));
	}, [relationships]);

	useEffect(() => {
		if (listMembers) {
			setAccountIds(listMembers.map(member => member.id));
		}
	}, [listMembers]);

	const handleAccountToggle = useCallback(
		(accountId: string) => {
			if (searchedUsers?.data?.some(user => user.id === accountId)) {
				setAccountIds(prev =>
					prev.includes(accountId)
						? prev.filter(id => id !== accountId)
						: [...prev, accountId],
				);
			}
		},
		[searchedUsers?.data],
	);

	const renderItem = useCallback(
		({ item }: { item: Patchwork.Account }) => (
			<ListMembersItem
				item={item}
				listId={listId}
				accountId={item.id}
				memberIds={memberIds}
				relationship={relationshipsMap.get(item.id)}
				partOfList={accountIds.includes(item.id)}
				onToggle={handleAccountToggle}
			/>
		),
		[accountIds, listId, relationshipsMap],
	);

	return (
		<SafeScreen>
			<Header
				title={t('screen.manage_list_members')}
				leftCustomComponent={<BackButton />}
				underlineClassName="mb-0"
			/>

			<View className="p-4">
				<ThemeText className=" font-NewsCycle_Bold" size={'lg_18'}>
					{t('list.add_to_your_list')}
				</ThemeText>
				<ThemeText variant={'textGrey'}>{t('list.add_list_desc')}</ThemeText>
			</View>

			<TextInput
				placeholder={t('list.search_users')}
				extraContainerStyle="h-11 w-100 mb-2 mx-4"
				startIcon={<SearchIcon />}
				value={searchKeyword}
				onChangeText={str => setSearchKeyword(str)}
			/>

			{isListMembersLoading ? (
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
					data={members}
					extraData={[]}
					showsVerticalScrollIndicator={false}
					keyboardDismissMode="on-drag"
					renderItem={renderItem}
					keyExtractor={item => item.id.toString()}
					getItemType={item => {
						return item.id;
					}}
					ListEmptyComponent={() => {
						return (
							<ListEmptyComponent
								title={t('list.no_members_yet')}
								subtitle={t('list.find_user_to_add')}
							/>
						);
					}}
					ItemSeparatorComponent={Underline}
					contentContainerStyle={{
						paddingBottom: bottom,
					}}
				/>
			)}

			<Button
				className={cn('mb-6 mx-4', isTablet ? 'w-[50%] self-center' : '')}
				onPress={() => {
					isEditMember
						? navigation.navigate('ListTimelines', {
								id: listId,
								title: listTimelinesTitle,
						  })
						: navigation.replace('ListTimelines', {
								id: listId,
								title: listTimelinesTitle,
						  });
				}}
			>
				<ThemeText className="text-white dark:text-white">
					{t('common.done')}
				</ThemeText>
			</Button>
		</SafeScreen>
	);
};

export default ManageListMembers;
