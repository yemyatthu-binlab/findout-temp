import { AxiosResponse } from 'axios';
import instance from './instance';
import { appendApiVersion, handleError } from '@/util/helper/helper';
import { useAuthStore } from '@/store/auth/authStore';

export type PushNotiTokenMutationPayload = {
	notification_token: string | null;
	platform_type: string;
};

export const pushNotiTokenMutationFn = async (
	params: PushNotiTokenMutationPayload,
) => {
	try {
		const resp: AxiosResponse<{ message: string }> = await instance.post(
			appendApiVersion('notification_tokens', 'v1'),
			params,
		);
		return resp.data;
	} catch (error) {
		return handleError(error);
	}
};

export const pushNotiRevokeTokenMutationFn = async (params: {
	notification_token: string;
}) => {
	try {
		const resp: AxiosResponse<{ message: string }> = await instance.post(
			appendApiVersion('notification_tokens/revoke_token', 'v1'),
			params,
		);
		return resp.data;
	} catch (error) {
		return handleError(error);
	}
};

export const mutePushNoti = async (params: { mute: boolean }) => {
	try {
		const resp: AxiosResponse<{ message: string }> = await instance.post(
			appendApiVersion('notification_tokens/update_mute', 'v1'),
			params,
		);
		return resp.data;
	} catch (error) {
		return handleError(error);
	}
};

export const changeEmailNotiSetting = async (params: { allowed: boolean }) => {
	try {
		const resp: AxiosResponse<{ message: string }> = await instance.post(
			appendApiVersion('patchwork/email_settings/notification', 'v1'),
			params,
		);
		return resp.data;
	} catch (error) {
		return handleError(error);
	}
};
