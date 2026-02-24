import { Pressable, View, ViewProps, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SearchStackParamList } from '@/types/navigation';
import { useCallback, useMemo } from 'react';
import Toast from 'react-native-toast-message';
import { useUserRelationshipMutation } from '@/hooks/mutations/profile.mutation';
import { queryClient } from '@/App';
import {
	useCheckRelationships,
	useSpecificServerProfile,
} from '@/hooks/queries/profile.queries';
import { findAccountId, formatNumber } from '@/util/helper/helper';
import { Flow } from 'react-native-animated-spinkit';
import { useAuthStore } from '@/store/auth/authStore';
import Image from '@/components/atoms/common/Image/Image';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import Bio from '@/components/atoms/profile/Bio/Bio';
import FastImage from '@d11/react-native-fast-image';

type Props = {
	item: Patchwork.Account;
	gradientColors: string[];
} & ViewProps;

const StarterPackDetailItem = ({ item, gradientColors, ...props }: Props) => {
	const navigation = useNavigation<StackNavigationProp<SearchStackParamList>>();
	const { userInfo } = useAuthStore();

	const { data: specificServerProfile } = useSpecificServerProfile({
		q: item?.url as string,
		options: {
			enabled: !!item?.url,
		},
	});

	const accountId = findAccountId(specificServerProfile, item);

	const isAuthor = useMemo(() => {
		return userInfo?.id === accountId;
	}, [accountId, userInfo?.id]);

	const { data: relationships } = useCheckRelationships({
		accountIds: [accountId!],
		options: { enabled: !!accountId },
	});

	const { mutate, isPending } = useUserRelationshipMutation({
		onSuccess: (newRelationship, { accountId: acctId }) => {
			const relationshipQueryKey = [
				'check-relationship-to-other-accounts',
				{ accountIds: [accountId] },
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
				topOffset: Platform.OS === 'android' ? 25 : 50,
			});
		},
	});

	const onMakeRelationship = useCallback(() => {
		if (!isPending && accountId) {
			mutate({
				accountId: accountId,
				isFollowing:
					relationships?.[0]?.following ||
					relationships?.[0]?.requested ||
					false,
			});
		}
	}, [mutate, accountId, relationships]);

	return (
		<View className="px-4">
			<View className="rounded-2xl mb-4 w-full bg-patchwork-light-100 dark:bg-zinc-900 shadow-md overflow-hidden pb-4">
				{item.header ? (
					<FastImage
						source={{ uri: item.header }}
						className="w-full h-20 bg-patchwork-grey-400"
						resizeMode="cover"
					/>
				) : (
					<View className="w-full h-20 bg-patchwork-grey-100 dark:bg-zinc-600" />
				)}

				<View className="px-4 -mt-8">
					<Pressable
						onPress={() => {
							isAuthor
								? navigation.navigate('Profile', { id: accountId || '' })
								: navigation.navigate('ProfileOther', { id: accountId || '' });
						}}
					>
						<Image
							source={{ uri: item.avatar }}
							className="w-16 h-16 rounded-full border-2 border-white dark:border-black"
						/>
					</Pressable>

					<View className="mt-2">
						<ThemeText
							className="font-NewsCycle_Bold text-lg"
							style={{ color: gradientColors[0] }}
							emojis={item.emojis}
						>
							{item.display_name || item.username}
						</ThemeText>

						<ThemeText variant={'textGrey'} size={'fs_13'}>
							@{item.acct}
						</ThemeText>
					</View>

					<Bio
						userBio={item.note}
						customMaxWordCount={500}
						emojis={item.emojis}
					/>

					<View className="flex-row justify-between mt-4">
						<View className="items-center">
							<ThemeText className="font-NewsCycle_Bold">
								{formatNumber(item.statuses_count)}{' '}
							</ThemeText>
							<ThemeText size={'xs_12'}>Posts</ThemeText>
						</View>

						<View className="items-center">
							<ThemeText className="font-NewsCycle_Bold">
								{formatNumber(item.followers_count)}
							</ThemeText>
							<ThemeText size={'xs_12'}>Followers</ThemeText>
						</View>

						<View className="items-center">
							<ThemeText className="font-NewsCycle_Bold">
								{formatNumber(item.following_count)}
							</ThemeText>
							<ThemeText size={'xs_12'}>Following</ThemeText>
						</View>
					</View>

					<Pressable
						className="mt-4 h-10 justify-center py-2 rounded-xl items-center"
						onPress={onMakeRelationship}
						disabled={isPending}
						style={{ backgroundColor: gradientColors[0] }}
					>
						{isPending ? (
							<Flow size={14} color="#fff" />
						) : (
							<ThemeText className="font-NewsCycle_Bold text-white">
								{relationships?.[0]?.following
									? 'Unfollow'
									: relationships?.[0]?.requested
									? 'Requested'
									: 'Follow'}
							</ThemeText>
						)}
					</Pressable>
				</View>
			</View>
		</View>
	);
};

export default StarterPackDetailItem;
