import { Pressable, TouchableOpacity, View } from 'react-native';
import StatusHeader from '@/components/atoms/feed/StatusHeader/StatusHeader';
import StatusContent from '@/components/atoms/feed/StatusContent/StatusContent';
import Underline from '@/components/atoms/common/Underline/Underline';
import StatusActionBar from '@/components/molecules/feed/StatusActionBar/StatusActionBar';
import { useActiveFeedAction } from '@/store/feed/activeFeed';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '@/types/navigation';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '@/store/auth/authStore';
import { useStatusContext } from '@/context/statusItemContext/statusItemContext';

const ChannelFeedStatus = ({
	status,
	isFromNoti,
}: {
	status: Patchwork.Status;
	isFromNoti?: boolean;
}) => {
	const { userInfo } = useAuthStore();

	const { setActiveFeed, setFeedDetailExtraPayload } = useActiveFeedAction();
	const { extraPayload } = useStatusContext();
	const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();

	const handleOnPressStatus = (status: Patchwork.Status) => {
		setActiveFeed(status.reblog ? status.reblog : status);
		if (extraPayload?.profileSource && extraPayload.profileFeedQueryId) {
			setFeedDetailExtraPayload({
				comeFrom: extraPayload.profileSource == 'own' ? 'profile' : 'other',
				carriedPayload: {
					profileFeedQueryId: extraPayload.profileFeedQueryId,
				},
			});
		}
		navigation.push('FeedDetail', {
			id: status.reblog ? status.reblog.id : status.id,
		});
	};

	if (!status?.account) {
		return null;
	}

	return (
		<View>
			<View className="m-4">
				{status && (
					<Pressable
						onPress={() => {
							handleOnPressStatus(status!);
						}}
					>
						<StatusHeader
							imageSize="w-7 h-7"
							status={status}
							isFromNoti={isFromNoti}
							showAvatarIcon
						/>
						<View className="ml-10">
							<StatusContent status={status} />
						</View>
					</Pressable>
				)}
				<View className="ml-10">
					<StatusActionBar status={status} isFromNoti={isFromNoti} />
				</View>
			</View>
			<Underline />
		</View>
	);
};

export default ChannelFeedStatus;
