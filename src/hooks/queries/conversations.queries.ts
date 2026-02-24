import {
	getAllNotiReq,
	getAllNotiReqWPagination,
	getConversationByUserId,
	getConversationsList,
	getMessageList,
	searchUsers,
} from '@/services/conversations.service';
import {
	ConversationByUserIdQueryKey,
	MessageListQueryKey,
	NotiReqQueryKey,
	SearchUsersQueryKey,
} from '@/types/queries/conversations.type';
import { QueryOptionHelper } from '@/util/helper/helper';
import {
	InfiniteData,
	useInfiniteQuery,
	useQuery,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

export const useSearchUsers = ({
	options,
	...queryParam
}: SearchUsersQueryKey[1] & {
	options?: QueryOptionHelper<AxiosResponse<Patchwork.Account[]> | undefined>;
}) => {
	const queryKey: SearchUsersQueryKey = ['users', queryParam];
	return useQuery({
		queryKey,
		//@ts-expect-error
		queryFn: searchUsers,
		...options,
	});
};

export const useGetConversationsList = (
	options?: QueryOptionHelper<Patchwork.Conversations[] | undefined>,
) => {
	return useInfiniteQuery<
		Patchwork.Conversations[],
		Error,
		InfiniteData<Patchwork.Conversations[]>
	>({
		queryKey: ['conversations'],
		//@ts-expect-error
		queryFn: ({ pageParam }: { pageParam: string | null }) =>
			getConversationsList({ pageParam }),
		...options,
		getNextPageParam: (lastPage: Patchwork.Conversations[]) => {
			if (!lastPage || lastPage.length === 0) return undefined;
			const lastParam = lastPage[lastPage.length - 1]?.last_status?.id;
			return lastParam;
		},
		select: data => {
			const deduplicatedList: Patchwork.Conversations[] = data.pages
				.flat()
				.filter(
					(item, index, self) =>
						index === self.findIndex(t => t.id === item.id),
				);

			return {
				...data,
				pages: [deduplicatedList],
			};
		},
	});
};

export const useMessageListQuery = ({
	id,
	options,
}: MessageListQueryKey[1] & {
	options?: QueryOptionHelper<Patchwork.TimelineReplies | undefined>;
}) => {
	const queryKey: MessageListQueryKey = ['message-list', { id }];
	//@ts-expect-error
	return useQuery({ queryKey, queryFn: getMessageList, ...options });
};

export const useGetAllNotiReqWPagination = (
	options?: QueryOptionHelper<Patchwork.NotiReq[] | undefined>,
) => {
	return useInfiniteQuery<
		Patchwork.NotiReq[],
		Error,
		InfiniteData<Patchwork.NotiReq[]>
	>({
		queryKey: ['all-noti-req'],
		//@ts-expect-error
		queryFn: ({ pageParam }: { pageParam: string | null }) =>
			getAllNotiReqWPagination({ pageParam }),
		...options,
		getNextPageParam: (lastPage: Patchwork.NotiReq[]) => {
			if (!lastPage || lastPage.length === 0) return undefined;
			const lastParam = lastPage[lastPage.length - 1]?.last_status?.id;
			return lastParam;
		},
		select: data => {
			const deduplicatedList: Patchwork.NotiReq[] = data.pages
				.flat()
				.filter(
					(item, index, self) =>
						index === self.findIndex(t => t.id === item.id),
				);

			return {
				...data,
				pages: [deduplicatedList],
			};
		},
	});
};

export const useGetAllNotiReq = (
	options?: QueryOptionHelper<Patchwork.NotiReq[] | undefined>,
) => {
	const queryKey: NotiReqQueryKey = ['all-noti-req'];
	return useQuery({ queryKey, queryFn: getAllNotiReq, ...options });
};

export const useGetConversationByUserId = ({
	id,
	options,
}: ConversationByUserIdQueryKey[1] & {
	options?: QueryOptionHelper<Patchwork.Conversations | undefined>;
}) => {
	const queryKey: ConversationByUserIdQueryKey = ['user-conversation', { id }];
	//@ts-expect-error
	return useQuery({ queryKey, queryFn: getConversationByUserId, ...options });
};
