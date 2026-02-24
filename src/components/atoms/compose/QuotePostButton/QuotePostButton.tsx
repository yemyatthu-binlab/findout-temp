import { useComposeStatus } from '@/context/composeStatusContext/composeStatus.context';
import { useQuoteMutation } from '@/hooks/mutations/feed.mutation';
import {
	useManageAttachmentActions,
	useManageAttachmentStore,
} from '@/store/compose/manageAttachments/manageAttachmentStore';
import { useQuoteStore } from '@/store/feed/quoteStore';
import { BottomStackParamList } from '@/types/navigation';
import { changeOwnerQuoteStatusCount } from '@/util/cache/feed/feedCache';
import customColor from '@/util/constant/color';
import { POLL_LIMITS } from '@/util/constant/pollOption';
import { prepareQuotePayload } from '@/util/helper/compose';
import { cn } from '@/util/helper/twutil';
import { ComposeRepostSendIcon } from '@/util/svg/icon.compose';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { uniqueId } from 'lodash';
import { useColorScheme } from 'nativewind';
import { Platform, Pressable } from 'react-native';
import { Flow } from 'react-native-animated-spinkit';
import Toast from 'react-native-toast-message';

type Props = {
	quotedStatusid: string;
};

const QuotePostButton = ({ quotedStatusid }: Props) => {
	const { colorScheme } = useColorScheme();
	const { composeState, composeDispatch } = useComposeStatus();
	const navigation = useNavigation<StackNavigationProp<BottomStackParamList>>();

	const { resetAttachmentStore } = useManageAttachmentActions();
	const { progress } = useManageAttachmentStore();
	const isMediaUploading = progress.currentIndex !== undefined;

	const { quotedStatus: prevCachedQuotedStatus } = useQuoteStore();

	const { mutate, isPending } = useQuoteMutation({
		onSuccess: (status: Patchwork.Status) => {
			Toast.show({
				type: 'successToast',
				text1: 'Quoted successfully',
				position: 'top',
				topOffset: Platform.OS == 'android' ? 25 : 50,
			});

			prevCachedQuotedStatus &&
				changeOwnerQuoteStatusCount(prevCachedQuotedStatus, 'increase');

			navigation.goBack();
			resetAttachmentStore();
			composeDispatch({ type: 'clear' });
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

	const handleRepostStatus = () => {
		if (
			composeState.text.count <= composeState.maxCount &&
			composeState.visibility !== 'private'
		) {
			const payload = prepareQuotePayload(composeState, quotedStatusid);
			mutate(payload);
		}
	};

	const disabledComposeRepostButton = () => {
		const { text, poll, maxCount } = composeState;
		const hasEmptyPollOptions = poll?.options?.some(
			option => option.trim() === '',
		);
		const insufficientPollOptions =
			poll && poll.options?.length < POLL_LIMITS.MIN_OPTIONS;

		return (
			isPending ||
			isMediaUploading ||
			insufficientPollOptions ||
			hasEmptyPollOptions ||
			composeState.text.count == 0 ||
			text.count > maxCount
		);
	};

	return (
		<Pressable
			onPress={handleRepostStatus}
			disabled={disabledComposeRepostButton()}
			className={cn(
				`${
					disabledComposeRepostButton() && 'opacity-40'
				} w-10 h-10 items-center justify-center rounded-full border-[1px] border-patchwork-grey-100`,
			)}
		>
			{isPending ? (
				<Flow
					size={15}
					color={
						colorScheme === 'dark' ? '#fff' : customColor['patchwork-dark-100']
					}
				/>
			) : (
				<ComposeRepostSendIcon colorScheme={colorScheme} />
			)}
		</Pressable>
	);
};

export default QuotePostButton;
