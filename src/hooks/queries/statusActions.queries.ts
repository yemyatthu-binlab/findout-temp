import { getBookmarkList } from '@/services/statusActions.service';
import { GetBookmarkListQueryKey } from '@/types/queries/statusActions';
import { infinitePageParam, PagedResponse } from '@/util/helper/timeline';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

export const useGetBookmarkList = (queryParam: GetBookmarkListQueryKey[1]) => {
	const queryKey: GetBookmarkListQueryKey = ['bookmark-list', queryParam];
	return useInfiniteQuery<
		PagedResponse<Patchwork.Status[]>,
		Error,
		InfiniteData<PagedResponse<Patchwork.Status[]>>
	>({
		queryKey,
		//@ts-expect-error
		queryFn: getBookmarkList,
		...infinitePageParam,
	});
};
