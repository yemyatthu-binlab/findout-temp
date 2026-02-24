export type SearchUsersQueryParam = {
	q: string;
	resolve?: boolean;
	limit?: number;
};

export type SearchUsersQueryKey = ['users', SearchUsersQueryParam];

export type ConversationsQueryParam = {
	max_id?: string | null;
	limit?: number;
	since_id?: string | null;
	min_id?: string | null;
};

export type MessageListQueryKey = ['message-list', { id: string }];

export type PaginatedResponse<T, P extends object = {}> = {
	pageParams: P;
	pages: T[];
};

export type NotiReqQueryKey = ['all-noti-req'];

export type ConversationByUserIdQueryKey = [
	'user-conversation',
	{ id: string },
];
