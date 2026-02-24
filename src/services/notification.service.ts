import { QueryFunctionContext } from '@tanstack/query-core';
import { AxiosResponse } from 'axios';
import instance from './instance';
import { appendApiVersion, handleError } from '@/util/helper/helper';

export type GroupedNotificationsQueryKey = ['get-grouped-notification'];
export type NormalNotificationQueryKey = ['get-normal-notification'];

export type MentionsNotificationsQueryKey = ['mention-noti-query-key'];
export type FollowRequestQueryKey = ['follow-request-query-key'];

export interface NotificationItem {
	group_key: string;
	type:
		| 'follow'
		| 'favourite'
		| 'mention'
		| 'reblog'
		| 'poll'
		| 'update'
		| 'admin.report'
		| 'status'
		| 'severed_relationships'
		| 'moderation_warning';
	latest_page_notification_at: string;
	account: Patchwork.Account;
	status?: Patchwork.Status | null;
}

export interface INotificationResponse {
	id: string;
	type:
		| 'follow'
		| 'favourite'
		| 'mention'
		| 'reblog'
		| 'poll'
		| 'update'
		| 'status'
		| 'admin.report'
		| 'admin.sign_up'
		| 'severed_relationships'
		| 'moderation_warning'
		| 'annual_report'
		| 'quote'
		| 'quoted_update';
	group_key: string;
	status: Patchwork.Status;
	account: Patchwork.Account;
	created_at: string;
	report?: {
		id: string;
		action_taken: boolean;
		action_taken_at?: string;
		category: string;
		comment: string;
		forwarded: boolean;
		created_at: string;
		status_ids?: string[];
		rule_ids?: string[];
		target_account: Patchwork.Account;
	};
	event?: Patchwork.RelationshipSeveranceEvent;
	moderation_warning?: {
		id: string;
		action:
			| 'none'
			| 'disable'
			| 'silence'
			| 'suspend'
			| 'mark_statuses_as_sensitive'
			| 'delete_statuses'
			| 'sensitive';
		text: string;
		status_ids: string[];
		target_account: Patchwork.Account;
	};
}

export const getGroupedNotification = async (
	qfContext: QueryFunctionContext<GroupedNotificationsQueryKey, string>,
) => {
	const max_id = qfContext.pageParam;

	const response: AxiosResponse<Patchwork.GroupedNotificationResults> =
		await instance.get(appendApiVersion('notifications', 'v2'), {
			params: {
				limit: 20,
				max_id,
				grouped_types: ['favourite', 'reblog', 'follow'],
				exclude_types: ['follow_request'],
				exclude_private_mentions: true,
			},
		});

	const linkHeader = response.headers.link as string;
	let maxId = null;
	if (linkHeader) {
		const regex = /max_id=(\d+)/;
		const match = linkHeader.match(regex);
		if (match) {
			maxId = match[1];
		}
	}

	return {
		data: response.data,
		links: { next: { max_id: maxId } },
	};
};

export const getNormalNotification = async (
	qfContext: QueryFunctionContext<
		NormalNotificationQueryKey,
		string | undefined
	>,
) => {
	const max_id = qfContext.pageParam;

	const response: AxiosResponse<INotificationResponse[]> = await instance.get(
		appendApiVersion('notifications', 'v1'),
		{
			params: {
				limit: 20,
				max_id,
				exclude_types: ['follow_request'],
				exclude_private_mentions: true,
			},
		},
	);

	const linkHeader = response.headers.link as string;
	let maxId = null;
	if (linkHeader) {
		const regex = /max_id=(\d+)/;
		const match = linkHeader.match(regex);
		if (match) {
			maxId = match[1];
		}
	}

	return {
		data: response.data,
		links: { next: { max_id: maxId } },
	};
};

export const getMentionsNotifications = async (
	_: QueryFunctionContext<MentionsNotificationsQueryKey>,
) => {
	const response: AxiosResponse<INotificationResponse[]> = await instance.get(
		appendApiVersion('notifications'),
		{
			params: {
				grouped_types: ['favourite', 'reblog', 'follow'],
				exclude_types: [
					'follow',
					'follow_request',
					'favourite',
					'reblog',
					'poll',
					'status',
					'update',
					'admin.sign_up',
					'admin.report',
					'moderation_warning',
					'severed_relationships',
					'annual_report',
					'quote',
					'quoted_update',
				],
				exclude_private_mentions: true,
			},
		},
	);

	return response.data;

	// const { accounts, statuses, notification_groups } = response.data;

	// return {
	// 	accounts: accounts || [],
	// 	statuses: statuses || [],
	// 	notification_groups: notification_groups || [],
	// };
};

export const getFollowRequests = async (
	qfContext: QueryFunctionContext<FollowRequestQueryKey>,
) => {
	try {
		const max_id = qfContext.pageParam as string;

		const resp: AxiosResponse<Patchwork.Account[]> = await instance.get(
			appendApiVersion('follow_requests'),
			{
				params: {
					max_id,
				},
			},
		);
		const linkHeader = resp.headers.link as string;
		let maxId = null;
		if (linkHeader) {
			const regex = /max_id=(\d+)/;
			const match = linkHeader.match(regex);
			if (match) {
				maxId = match[1];
			}
		}

		return {
			data: resp.data,
			links: { next: { max_id: maxId } },
		};
	} catch (e) {
		return handleError(e);
	}
};

export const getMuteUnMuteNotification = async () => {
	try {
		const response: AxiosResponse<{ mute: boolean }> = await instance.get(
			appendApiVersion('notification_tokens/get_mute_status'),
		);
		return response.data;
	} catch (e) {
		return handleError(e);
	}
};

export const getNotificationMarker = async () => {
	try {
		const response: AxiosResponse<Patchwork.NotificationMarker> =
			await instance.get(appendApiVersion('markers?timeline[]=notifications'));
		return response.data;
	} catch (e) {
		return handleError(e);
	}
};

export const checkEmailNotiSetting = async () => {
	try {
		const response: AxiosResponse<{ data: boolean }> = await instance.get(
			appendApiVersion('patchwork/email_settings'),
		);
		return response.data;
	} catch (e) {
		return handleError(e);
	}
};

export const markLastReadNotification = async ({ id }: { id: string }) => {
	try {
		const formData = new FormData();
		formData.append('notifications[last_read_id]', id);

		const resp: AxiosResponse<Patchwork.NotificationMarker> =
			await instance.post(appendApiVersion(`markers`, 'v1'), formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
		return resp.data;
	} catch (error) {
		return handleError(error);
	}
};
