import { useComposeStatus } from '@/context/composeStatusContext/composeStatus.context';
import { useComposeMutation } from '@/hooks/mutations/feed.mutation';
import { ConversationsStackParamList } from '@/types/navigation';
import { prepareComposePayload } from '@/util/helper/compose';
import { removeOtherMentions } from '@/util/helper/removeOtherMentions';
import { cn } from '@/util/helper/twutil';
import { SendIcon } from '@/util/svg/icon.conversations';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useColorScheme } from 'nativewind';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { validateMsgText } from '@/util/helper/validateMsgText';
import { useAuthStore } from '@/store/auth/authStore';
import { getInstanceName } from '@/util/helper/getInstanceName';
import { Platform } from 'react-native';

type Props = {
	extraClass?: string;
	disabled?: boolean;
};
const SendButton = ({ extraClass, disabled }: Props) => {
	const navigation =
		useNavigation<StackNavigationProp<ConversationsStackParamList>>();
	const { colorScheme } = useColorScheme();
	const { composeState, composeDispatch } = useComposeStatus();
	const { userOriginInstance } = useAuthStore();
	const defaultInstance = getInstanceName(userOriginInstance);
	const { mutate, isPending } = useComposeMutation({
		onSuccess: (response: Patchwork.Status) => {
			navigation.navigate('ConversationDetail', {
				id: response.id,
			});
			composeDispatch({ type: 'clear' });
		},
		onError: e => {
			Toast.show({
				type: 'errorToast',
				text1: 'Something went wrong',
				position: 'top',
				topOffset: Platform.OS == 'android' ? 25 : 50,
			});
		},
	});
	const handleSend = () => {
		if (
			composeState.text.count <= composeState.maxCount &&
			composeState.text.raw.trim() !== '' &&
			composeState.text.raw &&
			!isPending
		) {
			let payload;
			payload = prepareComposePayload(composeState);
			payload.visibility = 'direct';
			payload.status = removeOtherMentions(payload.status, defaultInstance);
			const pass = validateMsgText(payload.status);
			if (pass) {
				mutate(payload);
			}
		}
	};

	return (
		<TouchableOpacity
			onPress={handleSend}
			disabled={disabled}
			className={cn(
				'w-10 h-10 items-center justify-center rounded-full border-[1px] border-patchwork-grey-100',
				extraClass,
			)}
		>
			<SendIcon colorScheme={colorScheme} />
		</TouchableOpacity>
	);
};

export default SendButton;
