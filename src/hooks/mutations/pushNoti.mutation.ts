import { markLastReadNotification } from '@/services/notification.service';
import {
	PushNotiTokenMutationPayload,
	changeEmailNotiSetting,
	mutePushNoti,
	pushNotiRevokeTokenMutationFn,
	pushNotiTokenMutationFn,
} from '@/services/pushNoti.service';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const usePushNotiTokenMutation = (
	options: UseMutationOptions<
		{ message: string },
		AxiosError,
		PushNotiTokenMutationPayload
	>,
) => {
	return useMutation({ mutationFn: pushNotiTokenMutationFn, ...options });
};

export const usePushNotiRevokeTokenMutation = (
	options: UseMutationOptions<
		{ message: string },
		AxiosError,
		{ notification_token: string }
	>,
) => {
	return useMutation({ mutationFn: pushNotiRevokeTokenMutationFn, ...options });
};

export const useMutePushNotification = (
	options: UseMutationOptions<
		{ message: string },
		AxiosError,
		{ mute: boolean }
	>,
) => {
	return useMutation({ mutationFn: mutePushNoti, ...options });
};

export const useMarkLastReadNotification = (
	options: UseMutationOptions<
		Patchwork.NotificationMarker,
		AxiosError,
		{ id: string }
	>,
) => {
	return useMutation({ mutationFn: markLastReadNotification, ...options });
};

export const useChangeEmailNotiSetting = (
	options: UseMutationOptions<
		{ message: string },
		AxiosError,
		{ allowed: boolean }
	>,
) => {
	return useMutation({ mutationFn: changeEmailNotiSetting, ...options });
};
