import { queryClient } from '@/App';
import { useActiveConversationStore } from '@/store/conversation/activeConversationStore';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import dayjs from 'dayjs';
import moment from 'moment';
import Sound from 'react-native-sound';
import i18n from '@/i18n';
import 'moment/min/locales';
import { TFunction } from 'i18next';

export const isMsgTimeClose = (
	message: Patchwork.Status,
	prevMessage: Patchwork.Status | undefined,
) => {
	if (!prevMessage) return true;
	return (
		Math.abs(
			dayjs(message.created_at).diff(dayjs(prevMessage.created_at), 'minute'),
		) < 30
	);
};

export const formatMessageDate = (createdAt: string, t: TFunction): string => {
	moment.locale(i18n.language);
	const date = moment(createdAt);
	const now = moment();

	if (date.isSame(now, 'day')) {
		return `${t('conversation.time_stamp.today')} ${date.format('LT')}`;
	}

	if (date.isSame(now.clone().subtract(1, 'day'), 'day')) {
		return `${t('conversation.time_stamp.yesterday')} ${date.format('LT')}`;
	}

	if (date.isSame(now, 'week')) {
		return `${date.format('dddd LT')}`;
	}
	return `${date.format('MMM D, LT')}`;
};

export function formatMessageSentTime(timestamp: string | Date): string {
	const lang = i18n.language.split('-')[0];
	moment.locale(lang);
	return moment(timestamp).format('lll');
}

export const generateTWClassForImageSize = (
	totalImage: number,
	currentImageIdx: number,
) => {
	if (totalImage == 2) {
		return ` ${
			currentImageIdx == 0
				? 'rounded-tl-xl border-r rounded-br-xl'
				: 'rounded-tr-xl rounded-br-xl'
		}`;
	}
	if (totalImage == 3) {
		return ` ${currentImageIdx == 0 && 'w-full rounded-tl-xl rounded-br-xl'}`;
	}
};

export const handleIncommingMessage = async (
	notiResp: FirebaseMessagingTypes.RemoteMessage,
) => {
	const activeConvState = useActiveConversationStore.getState();

	if (activeConvState.activeConversation) {
		await queryClient.invalidateQueries({
			queryKey: [
				'message-list',
				{ id: activeConvState.activeConversation?.last_status.id },
			],
		});
		return playSound('receive');
	}

	await queryClient.invalidateQueries({ queryKey: ['conversations'] });
	playSound();
};

type SoundType = 'noti' | 'send' | 'receive';
export const playSound = (soundType: SoundType = 'noti') => {
	const soundMap = {
		noti: require('../../../assets/sound/notisound.wav'),
		send: require('../../../assets/sound/message_send.wav'),
		receive: require('../../../assets/sound/message_receive.wav'),
	};
	const soundPath = soundMap[soundType];
	const sound = new Sound(soundPath, error => {
		if (error) {
			console.log('Failed to load the sound', error);
			return;
		}
		sound.play(() => sound.release());
	});
};

export const checkIsConversationNoti = (
	notiResp: FirebaseMessagingTypes.RemoteMessage,
) => {
	return (
		notiResp.data?.noti_type == 'mention' &&
		notiResp.data?.visibility == 'direct'
	);
};

export const getCurrentTotalMessageListAtPageEntry = (
	isFromExternalNotiAlert: boolean | undefined,
	lastMsgId: string,
) => {
	if (isFromExternalNotiAlert) {
		const messages = queryClient.getQueryData<Patchwork.TimelineReplies>([
			'message-list',
			{ id: lastMsgId },
		]);
		const totalMessageList = messages
			? [...messages?.descendants, ...messages?.ancestors]
			: [];
		return totalMessageList;
	}
	return [];
};

export const isFromNotificationMatch = (
	conversation: Patchwork.Conversations,
	totalMsgList: Patchwork.Status[],
) => totalMsgList.some(message => message.id === conversation.last_status?.id);

export const findMatchingStatus = (
	statusId: string,
	totalMsgList: Patchwork.Status[],
): Patchwork.Status | undefined =>
	totalMsgList.find(message => message.id === statusId);
