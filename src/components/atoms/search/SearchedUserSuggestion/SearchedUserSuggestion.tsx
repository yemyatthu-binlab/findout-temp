import AccountAvatar from '@/components/molecules/feed/AccountAvatar/AccountAvatar';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';
import { Platform, View } from 'react-native';
import { Button } from '../../common/Button/Button';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import { useUserRelationshipMutation } from '@/hooks/mutations/profile.mutation';
import { CheckRelationshipQueryKey } from '@/types/queries/profile.type';
import { queryClient } from '@/App';
import Toast from 'react-native-toast-message';
import { Flow } from 'react-native-animated-spinkit';
import customColor from '@/util/constant/color';
import { useAuthStore } from '@/store/auth/authStore';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';

interface SearchedUserSuggestionProps {
	item: Patchwork.Account;
	relationship: Patchwork.RelationShip | undefined;
	accountIds: string[];
}

const SearchedUserSuggestion = ({
	item,
	relationship,
	accountIds,
}: SearchedUserSuggestionProps) => {
	const { colorScheme } = useColorScheme();
	const { t } = useTranslation();
	const navigation = useNavigation();
	const { userInfo } = useAuthStore();

	const isAuthor = useMemo(() => {
		return userInfo?.id === item.id;
	}, [item, userInfo?.id]);

	const { mutate, isPending } = useUserRelationshipMutation({
		onSuccess: (newRelationship, { accountId: acctId }) => {
			const relationshipQueryKey: CheckRelationshipQueryKey = [
				'check-relationship-to-other-accounts',
				{ accountIds },
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

	const onMakeRelationship = useCallback(() => {
		mutate({
			accountId: item.id,
			isFollowing: relationship?.following || relationship?.requested || false,
		});
	}, [mutate, item.id, relationship]);

	const displayRelationshipText = useMemo(
		() =>
			relationship?.following
				? t('timeline.unfollow')
				: relationship?.requested
				? t('timeline.requested')
				: t('timeline.follow'),
		[relationship],
	);

	return (
		<View className="items-center mr-4 my-1">
			<AccountAvatar
				account={item}
				size={'md'}
				className="w-[110]"
				onPress={() => {
					if (isAuthor) {
						navigation.navigate('Profile', {
							id: item.id,
						});
					} else {
						navigation.navigate('ProfileOther', {
							id: item.id,
						});
					}
				}}
			/>
			{!isAuthor && (
				<Button
					disabled={isPending}
					size="sm"
					variant={'outline'}
					className="mt-2 rounded-3xl"
					onPress={onMakeRelationship}
				>
					{isPending ? (
						<Flow
							size={25}
							color={
								colorScheme === 'dark'
									? customColor['patchwork-light-900']
									: customColor['patchwork-dark-100']
							}
						/>
					) : (
						<ThemeText size={'fs_13'}>{displayRelationshipText}</ThemeText>
					)}
				</Button>
			)}
		</View>
	);
};

export default SearchedUserSuggestion;
