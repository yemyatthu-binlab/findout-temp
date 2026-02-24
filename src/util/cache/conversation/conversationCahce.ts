import { queryClient } from '@/App';
import { PaginatedResponse } from '@/types/queries/conversations.type';
import { DEFAULT_API_URL } from '@/util/constant';

export const addNewMsgToQueryCache = (
	msg: Patchwork.Status,
	currentId: string,
) => {
	const domain_name = process.env.API_URL ?? DEFAULT_API_URL;

	queryClient.setQueryData<Patchwork.TimelineReplies>(
		['message-list', { id: currentId }],
		oldData => {
			if (!oldData) return oldData;
			return {
				...oldData,
				descendants: [msg, ...oldData.descendants],
			};
		},
	);
};

export const changeLastMsgInConversationChache = (
	lastMsg: Patchwork.Status,
	currentConversationId: string | undefined,
) => {
	queryClient.setQueryData(['conversations'], (oldData: any) => {
		if (!oldData) return oldData;
		return {
			...oldData,
			pages: oldData.pages.map((page: any) =>
				page.map((conversation: Patchwork.Conversations) => {
					if (conversation?.id === currentConversationId) {
						return { ...conversation, last_status: lastMsg };
					} else {
						return conversation;
					}
				}),
			),
		};
	});
};

export const removeOldMsgListCacheAndCreateNewOne = (
	initialLastMsgId: string,
) => {
	queryClient.setQueryData<Patchwork.TimelineReplies>(
		['message-list', { id: initialLastMsgId }],
		oldData => {
			if (!oldData) return undefined;
			if (oldData.descendants.length == 0) return oldData;
			const finalLastMsg = oldData.descendants[0];
			const updatedMsgListQueryKey = ['message-list', { id: finalLastMsg.id }];
			const updatedMsgQueryCache: Patchwork.TimelineReplies = {
				ancestors: [...oldData.descendants.slice(1), ...oldData.ancestors],
				descendants: [],
			};
			queryClient.setQueryData(updatedMsgListQueryKey, updatedMsgQueryCache);
			return undefined;
		},
	);
};

export const markAsReadInConversationCache = (currentMsgId: string) => {
	queryClient.setQueryData(['conversations'], (oldData: any) => {
		if (!oldData) return oldData;
		return {
			...oldData,
			pages: oldData.pages.map((page: any) =>
				page.map((conversation: any) =>
					conversation.id === currentMsgId
						? { ...conversation, unread: false }
						: conversation,
				),
			),
		};
	});
};

export const removeDeletedMsgInConversationCache = (currentMsgId: string) => {
	queryClient.setQueryData(
		['conversations'],
		(oldData: PaginatedResponse<Patchwork.Conversations[]>) => {
			if (!oldData) return oldData;
			return {
				...oldData,
				pages: oldData.pages.map(page =>
					page.filter(conversation => {
						return conversation.id !== currentMsgId;
					}),
				),
			};
		},
	);
};

export const removeAcceptedNotiReq = (id: string) => {
	queryClient.setQueryData(
		['all-noti-req'],
		(oldData: Patchwork.NotiReq[] | undefined) =>
			oldData ? oldData.filter(item => item.id !== id) : [],
	);
};

export const removeDismissedNotiReq = (id: string) => {
	queryClient.setQueryData(
		['all-noti-req'],
		(oldData: Patchwork.NotiReq[] | undefined) =>
			oldData ? oldData.filter(item => item.id !== id) : [],
	);
};

export const updateConversationCacheInProfile = (
	id: string,
	lastStatus: Patchwork.Status,
) => {
	queryClient.setQueryData(
		['user-conversation', { id }],
		(oldData: Patchwork.Conversations | undefined) => {
			if (!oldData) return;
			return { ...oldData, last_status: lastStatus };
		},
	);
};

export const markAsReadAllConversationsCache = () => {
	queryClient.setQueryData(['conversations'], (oldData: any) => {
		if (!oldData) return oldData;
		return {
			...oldData,
			pages: oldData.pages.map((page: any) =>
				page.map((conversation: any) => ({
					...conversation,
					unread: false,
				})),
			),
		};
	});
};
