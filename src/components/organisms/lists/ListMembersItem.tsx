import { queryClient } from '@/App';
import { Button } from '@/components/atoms/common/Button/Button';
import Image from '@/components/atoms/common/Image/Image';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import FollowToListModal from '@/components/atoms/lists/FollowToListModal/FollowToListModal';
import {
	useAddAccountToListMutation,
	useRemoveAccountFromListMutation,
} from '@/hooks/mutations/lists.mutation';
import { useUserRelationshipMutation } from '@/hooks/mutations/profile.mutation';
import { useAuthStore } from '@/store/auth/authStore';
import { ListMembersQueryKey } from '@/types/queries/lists.type';
import { CheckRelationshipQueryKey } from '@/types/queries/profile.type';
import customColor from '@/util/constant/color';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, View } from 'react-native';
import { Flow } from 'react-native-animated-spinkit';
import Toast from 'react-native-toast-message';

const ListMembersItem = ({
	item,
	listId,
	accountId,
	memberIds,
	relationship,
	partOfList,
	onToggle,
}: {
	item: Patchwork.Account;
	listId: string;
	accountId: string;
	memberIds: string[];
	relationship: Patchwork.RelationShip | undefined;
	partOfList: boolean;
	onToggle: (acctId: string) => void;
}) => {
	const { t } = useTranslation();
	const navigation = useNavigation();
	const { userInfo } = useAuthStore();
	const { colorScheme } = useColorScheme();

	const [followToListModalVisible, setFollowToListModalVisible] =
		useState(false);

	const onPressFollowToListModal = () => {
		setFollowToListModalVisible(prevState => !prevState);
	};

	const isAuthor = useMemo(
		() =>
			userInfo?.id === item.id || item.acct === `${userInfo?.acct}@channel.org`,
		[item, userInfo?.id],
	);

	const following = useMemo(
		() =>
			accountId === userInfo?.id ||
			relationship?.following ||
			relationship?.requested,
		[accountId, userInfo?.id, relationship],
	);

	const { mutateAsync: followMemberMutateAsync } = useUserRelationshipMutation({
		onSuccess: (newRelationship, { accountId: acctId }) => {
			const relationshipQueryKey: CheckRelationshipQueryKey = [
				'check-relationship-to-other-accounts',
				{ accountIds: memberIds },
			];

			queryClient.setQueryData<Patchwork.RelationShip[]>(
				relationshipQueryKey,
				old => {
					if (!old) return [newRelationship];
					return old.map(rel =>
						rel.id === acctId ? { ...rel, ...newRelationship } : rel,
					);
				},
			);
		},
		onError: e => {
			Toast.show({
				type: 'errorToast',
				text1: e.message,
				position: 'top',
				topOffset: Platform.OS == 'android' ? 25 : 50,
			});
		},
	});

	const { mutateAsync: addAccountToListMutateAsync, isPending: isAddPending } =
		useAddAccountToListMutation({
			onSuccess(_, { accountId }) {
				const listMembersQueryKey: ListMembersQueryKey = [
					'list-members',
					{ id: listId },
				];
				queryClient.setQueryData<Patchwork.Account[]>(
					listMembersQueryKey,
					old => [...(old || []), item],
				);
				onToggle(accountId);
			},
			onError: e => {
				Toast.show({
					type: 'errorToast',
					text1: e.message,
					position: 'top',
					topOffset: Platform.OS == 'android' ? 25 : 50,
				});
			},
		});

	const { mutate: removeAccountFromListMutate, isPending: isRemovePending } =
		useRemoveAccountFromListMutation({
			onSuccess(_, { accountId }) {
				const listMembersQueryKey: ListMembersQueryKey = [
					'list-members',
					{ id: listId },
				];
				queryClient.setQueryData<Patchwork.Account[]>(
					listMembersQueryKey,
					old => {
						if (!old) return [];
						return old.filter(member => member.id !== accountId);
					},
				);
				onToggle(accountId);
			},
			onError: e => {
				Toast.show({
					type: 'errorToast',
					text1: e.message,
					position: 'top',
					topOffset: Platform.OS == 'android' ? 25 : 50,
				});
			},
		});

	const handleAddOrRemoveList = useCallback(() => {
		if (partOfList) {
			removeAccountFromListMutate({ id: listId, accountId: item.id });
		} else if (following) {
			addAccountToListMutateAsync({ id: listId, accountId: item.id });
		} else {
			onPressFollowToListModal();
		}
	}, [partOfList, following, listId, item.id]);

	const onPressConfimFollowToList = useCallback(() => {
		onPressFollowToListModal();
		followMemberMutateAsync({ accountId: item.id, isFollowing: false })
			.then(() =>
				addAccountToListMutateAsync({ id: listId, accountId: item.id }),
			)
			.catch(error => {});
	}, [listId, item.id]);

	const displayRelationshipText = useMemo(
		() => (partOfList ? t('common.remove') : t('common.add')),
		[partOfList],
	);

	return (
		<>
			<View className="flex-row items-center justify-between p-4">
				<Pressable
					className="mb-2 flex-row flex-1"
					onPress={() => {
						isAuthor
							? navigation.navigate('Profile', { id: item.id })
							: navigation.navigate('ProfileOther', {
									id: item.id,
							  });
					}}
				>
					<Image uri={item.avatar} className="w-10 h-10 rounded-full mr-3" />
					<View className="flex-1">
						<ThemeText emojis={item.emojis}>
							{item.display_name || item.username}
						</ThemeText>
						<ThemeText variant={'textGrey'} size={'fs_13'}>
							@{item.acct}
						</ThemeText>
					</View>
				</Pressable>
				{!isAuthor && (
					<Button
						disabled={isAddPending || isRemovePending}
						variant={partOfList ? 'outline' : 'default'}
						size="sm"
						onPress={handleAddOrRemoveList}
					>
						{isAddPending || isRemovePending ? (
							<Flow size={25} color={'#fff'} />
						) : (
							<ThemeText
								size={'fs_13'}
								className={!partOfList ? 'text-white dark:text-white' : ''}
							>
								{displayRelationshipText}
							</ThemeText>
						)}
					</Button>
				)}
			</View>
			{followToListModalVisible && (
				<FollowToListModal
					followUserName={item.acct}
					openModal={followToListModalVisible}
					onPressHideModal={onPressFollowToListModal}
					onPressConfirm={onPressConfimFollowToList}
				/>
			)}
		</>
	);
};

export default memo(ListMembersItem);
