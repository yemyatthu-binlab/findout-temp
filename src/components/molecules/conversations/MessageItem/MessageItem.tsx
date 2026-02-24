import Image from '@/components/atoms/common/Image/Image';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import MessageContent from '@/components/atoms/conversations/MessageContent/MessageContent';
import MessageImage from '@/components/atoms/conversations/MessageImage/MessageImage';
import StatusVideo from '@/components/atoms/feed/StatusVideo/StatusVideo';
import { useAuthStore } from '@/store/auth/authStore';
import { cleanText } from '@/util/helper/cleanText';
import { useActiveDomainAction } from '@/store/feed/activeDomain';
import {
	formatMessageDate,
	formatMessageSentTime,
	isMsgTimeClose,
} from '@/util/helper/conversation';
import { extractMessage } from '@/util/helper/extractMessage';
import { removePrivateConvoHashtag } from '@/util/helper/handlePrivateConvoHashtag';
import { cn } from '@/util/helper/twutil';
import { useNavigation } from '@react-navigation/native';
import { Pressable, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import { useTranslation } from 'react-i18next';

type Prop = {
	message: Patchwork.Status;
	previousMsg: Patchwork.Status | undefined;
	nextMsg: Patchwork.Status | undefined;
	currentMessageId: string | null;
	handlePress: (id: string | null) => void;
	isGroupChat: boolean;
};
const MessageItem = ({
	message,
	previousMsg,
	nextMsg,
	currentMessageId,
	handlePress,
	isGroupChat,
}: Prop) => {
	const { t } = useTranslation();
	const navigation = useNavigation();
	const { setDomain } = useActiveDomainAction();
	const { userInfo, userOriginInstance } = useAuthStore();
	const isOwnMessage = userInfo?.id == message.account.id;
	const isTwoMsgFromSameUser = previousMsg?.account.id === message.account.id;
	const isTwoMsgTimeClose = isMsgTimeClose(message, previousMsg);
	const showMsgTime = currentMessageId === message.id;
	const isVideoInclude =
		message?.media_attachments.length > 0 &&
		message?.media_attachments?.some(
			attachment => attachment.type === 'video' || attachment.type === 'gifv',
		);
	const msgText = removePrivateConvoHashtag(
		extractMessage(cleanText(message?.content)),
	);

	const onPress = () => {
		const newId = showMsgTime ? null : message.id;
		handlePress(newId);
	};

	const handleAvatarPress = (userInfo: Patchwork.Account) => {
		setDomain(userOriginInstance);
		navigation.navigate('ProfileOther', {
			id: userInfo?.id!,
		});
	};

	const showTimestamp =
		!isVideoInclude && showMsgTime && message.media_attachments.length === 0;

	return (
		<Pressable onPress={onPress} className="m-2">
			{message.media_attachments.length > 0 &&
				(isVideoInclude ? (
					<View className={cn('mb-3', isOwnMessage ? 'ml-20' : 'mr-20 ml-10')}>
						<StatusVideo status={message} />
					</View>
				) : (
					<View className={cn(!isGroupChat ? 'ml-8' : '')}>
						<MessageImage
							className={cn('w-auto flex-1')}
							{...{ message, isOwnMessage, isGroupChat }}
						/>
					</View>
				))}

			<View
				className={cn(
					'flex-row items-end',
					isOwnMessage ? 'justify-end' : 'justify-start',
					!isOwnMessage && message.media_attachments.length > 0 && !msgText
						? '-mt-10'
						: '',
				)}
			>
				{!isOwnMessage && (
					<Pressable
						className={cn(
							'w-8 h-8 bg-slate-100 rounded-full',
							showMsgTime && 'mb-3',
						)}
						onPress={() => handleAvatarPress(message.account)}
					>
						<Image
							className="w-8 h-8 rounded-full"
							source={{ uri: message.account.avatar }}
							resizeMode={FastImage.resizeMode.contain}
							iconSize={28}
						/>
					</Pressable>
				)}
				<View
					className={cn(
						isOwnMessage ? 'items-end' : 'items-start',
						showTimestamp ? '-top-2' : '',
					)}
					style={{ maxWidth: '85%' }}
				>
					<MessageContent
						item={message}
						isOwnMessage={isOwnMessage}
						showTimestamp={showTimestamp}
					/>
				</View>
			</View>

			{showTimestamp && (
				<ThemeText
					className={cn('mx-2 ml-10', isOwnMessage ? 'self-end' : 'self-start')}
					size={'xs_12'}
				>
					{formatMessageSentTime(message.created_at)}
				</ThemeText>
			)}
			{!isTwoMsgTimeClose && previousMsg && !isTwoMsgFromSameUser && (
				<ThemeText
					size={'xs_12'}
					className="items-center justify-center text-center mt-5 mb-0 text-gray-400"
				>
					{formatMessageDate(previousMsg.created_at, t)}
				</ThemeText>
			)}
		</Pressable>
	);
};
export default MessageItem;
