import Toast from 'react-native-toast-message';
import { checkIsCurrentSignedInUser } from './helper';
import { useTranslation } from 'react-i18next';

export function validateMsgText(status: string) {
	const { t } = useTranslation();
	const payloadText = status.trim();

	const mentionedUserRegex = /@\w+@[a-zA-Z0-9.-]+/;
	const hashtagRegex = /#\w+/;

	const mentionedUser = payloadText.match(mentionedUserRegex)?.[0];
	const hashtag = payloadText.match(hashtagRegex)?.[0];

	const messageText = payloadText
		.replace(mentionedUser || '', '')
		.replace(hashtag || '', '')
		.trim();
	if (!mentionedUser) {
		Toast.show({
			type: 'info',
			position: 'top',
			text1: 'Error',
			text2: t('toast.user_mention_required'),
			visibilityTime: 3000,
		});
		return false;
	}

	if (!messageText) {
		Toast.show({
			type: 'info',
			position: 'top',
			text1: 'Warning',
			text2: t('toast.message_required'),
			visibilityTime: 3000,
		});
		return false;
	}
	if (checkIsCurrentSignedInUser(mentionedUser)) {
		Toast.show({
			type: 'info',
			position: 'top',
			text1: 'Warning',
			text2: t('toast.cant_send_to_own_account'),
			visibilityTime: 3000,
		});
		return false;
	}

	return true;
}
