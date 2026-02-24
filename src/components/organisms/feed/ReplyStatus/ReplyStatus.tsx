import { Pressable, View } from 'react-native';
import StatusHeader from '@/components/atoms/feed/StatusHeader/StatusHeader';
import StatusContent from '@/components/atoms/feed/StatusContent/StatusContent';
import StatusActionBar from '@/components/molecules/feed/StatusActionBar/StatusActionBar';
import Underline from '@/components/atoms/common/Underline/Underline';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '@/types/navigation';
import { useActiveFeedAction } from '@/store/feed/activeFeed';
import { useStatusReplyStore } from '@/store/compose/statusReply/statusReplyStore';
import Image from '@/components/atoms/common/Image/Image';
import { useAuthStore } from '@/store/auth/authStore';
import { useMemo } from 'react';

const ReplyStatus = ({
	status,
	nextStatus,
	feedDetailId,
	isNestedNodeInclude,
	isAncenstorNode,
}: {
	status: Patchwork.Status;
	feedDetailId: string;
	nextStatus: Patchwork.Status | undefined;
	isNestedNodeInclude: boolean | undefined;
	isAncenstorNode?: boolean | undefined;
}) => {
	const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
	const { setActiveFeed } = useActiveFeedAction();
	const { currentFocusStatus } = useStatusReplyStore();
	const { userInfo } = useAuthStore();
	const isTopLevelNode =
		status.in_reply_to_id && status.in_reply_to_id == feedDetailId;
	const isAuthor = useMemo(() => {
		return userInfo?.id === status?.account?.id;
	}, [status?.account?.id, userInfo?.id]);

	const handleOnPress = (item: Patchwork.Status) => {
		setActiveFeed(item);
		navigation.push('FeedDetail', { id: item.id });
	};

	if (!status?.account) {
		return null;
	}

	return (
		<>
			{isTopLevelNode && !isAncenstorNode && <Underline />}
			{(isNestedNodeInclude || isAncenstorNode) && (
				<View className="absolute border-l  border-slate-200 dark:border-patchwork-grey-70 left-[30] top-[0] h-full" />
			)}
			{(isTopLevelNode || isAncenstorNode) && (
				<View className="absolute h-[30] w-[30] bg-white dark:bg-patchwork-dark-100 left-4 top-[1]" />
			)}
			<View className="m-4">
				<View className={isTopLevelNode || isAncenstorNode ? 'ml-0' : 'ml-10'}>
					<View className="flex-row">
						<Pressable
							onPress={() => {
								isAuthor
									? navigation.navigate('Profile', { id: status.account.id })
									: navigation.navigate('ProfileOther', {
											id: status.account.id,
									  });
							}}
						>
							<Image
								uri={status.account.avatar}
								className="w-[33] h-[33] rounded-full"
							/>
						</Pressable>
						<Pressable
							className="ml-2 flex-1"
							onPress={() => handleOnPress(status)}
						>
							<StatusHeader status={status} />
							<StatusContent status={status} />
						</Pressable>
					</View>
					<View className="ml-10">
						<StatusActionBar status={status} />
					</View>
				</View>
			</View>
			{nextStatus == undefined && !isAncenstorNode && <Underline />}
		</>
	);
};

export default ReplyStatus;
