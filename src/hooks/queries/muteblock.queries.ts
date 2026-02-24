import {
	getBlockedUserList,
	getMutedUserList,
} from '@/services/muteblock.service';
import {
	BlockedUserListQueryKey,
	MutedUserListQueryKey,
} from '@/types/queries/muteblock.type';
import { infinitePageParam, PagedResponse } from '@/util/helper/timeline';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

export const useGetMutedUserList = () => {
	const queryKey: MutedUserListQueryKey = ['muted-user-list'];
	return useInfiniteQuery<
		PagedResponse<Patchwork.MuteBlockUserAccount[]>,
		Error,
		InfiniteData<PagedResponse<Patchwork.MuteBlockUserAccount[]>>
	>({
		queryKey,
		//@ts-expect-error
		queryFn: getMutedUserList,
		...infinitePageParam,
	});
};

export const useGetBlockedUserList = () => {
	const queryKey: BlockedUserListQueryKey = ['blocked-user-list'];
	return useInfiniteQuery<
		PagedResponse<Patchwork.MuteBlockUserAccount[]>,
		Error,
		InfiniteData<PagedResponse<Patchwork.MuteBlockUserAccount[]>>
	>({
		queryKey,
		//@ts-expect-error
		queryFn: getBlockedUserList,
		...infinitePageParam,
	});
};
