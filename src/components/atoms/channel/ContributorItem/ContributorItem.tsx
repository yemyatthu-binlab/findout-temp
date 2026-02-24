import FastImage from '@d11/react-native-fast-image';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import { Button } from '../../common/Button/Button';
import { truncateStr } from '@/util/helper/helper';
import { cleanText } from '@/util/helper/cleanText';
import { useUserRelationshipMutation } from '@/hooks/mutations/profile.mutation';
import { Flow } from 'react-native-animated-spinkit';
import { View } from 'react-native';
import { updateContributorListInSearchModal } from '@/util/cache/channel/channelCache';
import { queryClient } from '@/App';
import { useGetMyTotalChannelList } from '@/hooks/queries/channel.queries';
import { useMuteUnmuteUserMutation } from '@/hooks/queries/feed.queries';
import Image from '../../common/Image/Image';
import { useColorScheme } from 'nativewind';
import customColor from '@/util/constant/color';

type Props = {
	user: Patchwork.Contributor;
	keyword: string;
	operationType: 'follow' | 'mute';
};
const ContributorItem = ({ user, keyword, operationType }: Props) => {
	const { data: myChannels } = useGetMyTotalChannelList();
	const channelId = myChannels?.[0]?.id || '';
	const { colorScheme } = useColorScheme();

	const { mutate: mutateUserFollow, isPending: isFollowInProgress } =
		useUserRelationshipMutation({
			onSuccess: (newRelationship, { isFollowing }) => {
				updateContributorListInSearchModal(
					keyword,
					user.id,
					isFollowing ? 'not_followed' : 'following',
					'follow',
				);
				queryClient.invalidateQueries({
					queryKey: ['contributor-list', { channelId }],
				});
			},
		});

	const { mutate: toggleMute, isPending: isMuteInProgress } =
		useMuteUnmuteUserMutation({
			onSuccess: response => {
				updateContributorListInSearchModal(
					keyword,
					user.id,
					'following',
					'mute',
				);
				queryClient.invalidateQueries({
					queryKey: ['muted-contributor-list', { channelId }],
				});
			},
		});

	const handleFollow = (id: string, isFollowing: boolean) => {
		mutateUserFollow({
			accountId: id,
			isFollowing: isFollowing,
		});
	};

	const handleMute = (id: string, isMuted: boolean) => {
		toggleMute({ accountId: id, toMute: !isMuted });
	};

	return (
		<View>
			<View className="py-4 flex-row items-center">
				<Image
					className="w-14 h-14 rounded-full mt-3 mr-3 border border-patchwork-grey-50"
					uri={user.avatar_url}
				/>
				<View className="flex-1">
					<View className="flex-row justify-between items-end mb-[1]">
						{/* unable to add emojis here as there is no such field in the api res  */}
						<ThemeText className="flex-1 flex-shrink mr-2">
							{user.display_name || user.username}
						</ThemeText>
						{operationType == 'follow' ? (
							<Button
								variant="outline"
								size="sm"
								className={'flex-shrink-0 mb-1'}
								onPress={() =>
									handleFollow(user.id, user.following == 'following')
								}
							>
								{isFollowInProgress ? (
									<Flow
										size={15}
										color={
											colorScheme === 'dark'
												? '#fff'
												: customColor['patchwork-dark-100']
										}
									/>
								) : (
									<ThemeText>
										{user.following == 'following' ? 'Unfollow' : 'Follow'}
									</ThemeText>
								)}
							</Button>
						) : (
							<Button
								variant="outline"
								size="sm"
								className={'flex-shrink-0 mb-1'}
								onPress={() => handleMute(user.id, user.is_muted)}
							>
								{isMuteInProgress ? (
									<Flow
										size={15}
										color={
											colorScheme === 'dark'
												? '#fff'
												: customColor['patchwork-dark-100']
										}
									/>
								) : (
									<ThemeText>{user.is_muted ? 'Unmute' : 'Mute'}</ThemeText>
								)}
							</Button>
						)}
					</View>
					<ThemeText className="mb-[1]">
						@{user.username}
						{user.domain ? `@${user.domain}` : ''}
					</ThemeText>
					<ThemeText variant="textGrey">
						{truncateStr(cleanText(user.note), 30)?.trim()}
					</ThemeText>
				</View>
			</View>
		</View>
	);
};

export default ContributorItem;
