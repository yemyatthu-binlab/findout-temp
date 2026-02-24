import {
	listDetailFn,
	listMembersFn,
	listsFn,
	listTimelinesFn,
} from '@/services/lists.service';
import {
	ListMembersQueryKey,
	ListDetailQueryKey,
	ListsQueryKey,
	ListTimelinesQueryKey,
} from '@/types/queries/lists.type';
import { QueryOptionHelper } from '@/util/helper/helper';
import { infinitePageParam, PagedResponse } from '@/util/helper/timeline';
import {
	InfiniteData,
	useInfiniteQuery,
	useQuery,
} from '@tanstack/react-query';

export const listsQueryKey: ListsQueryKey = ['lists'];
export const useListsQueries = () => {
	return useQuery({
		queryKey: listsQueryKey,
		queryFn: listsFn,
		staleTime: 1000 * 60 * 3,
		select: data => {
			return data.slice().sort((a, b) => parseInt(b.id) - parseInt(a.id));
		},
	});
};

export const useListsDetailQuery = ({
	options,
	...queryParam
}: ListDetailQueryKey[1] & {
	options?: QueryOptionHelper<Patchwork.Lists | undefined>;
}) => {
	const queryKey: ListDetailQueryKey = ['list-detail', queryParam];
	return useQuery({
		queryKey,
		//@ts-expect-error
		queryFn: listDetailFn,
		...options,
	});
};

export const useGetListTimelines = (queryParam: ListTimelinesQueryKey[1]) => {
	const queryKey: ListTimelinesQueryKey = ['list-timelines', queryParam];
	return useInfiniteQuery<
		PagedResponse<Patchwork.Status[]>,
		Error,
		InfiniteData<PagedResponse<Patchwork.Status[]>>
	>({
		queryKey,
		//@ts-expect-error
		queryFn: listTimelinesFn,
		...infinitePageParam,
	});
};

export const useListMembersQuery = ({
	options,
	...queryParam
}: ListMembersQueryKey[1] & {
	options?: QueryOptionHelper<Patchwork.Account[] | undefined>;
}) => {
	const queryKey: ListMembersQueryKey = ['list-members', queryParam];
	return useQuery({
		queryKey,
		//@ts-expect-error
		queryFn: listMembersFn,
		staleTime: 1000 * 60 * 3,
		...options,
	});
};
