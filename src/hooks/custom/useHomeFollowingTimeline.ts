import { useCallback, useMemo, useState, MutableRefObject } from 'react';
import { useQueryClient, InfiniteData } from '@tanstack/react-query';
import { throttle, delay } from 'lodash';
import { useAuthStore } from '@/store/auth/authStore';
import { useGetHomeTimeline } from '@/hooks/queries/channel.queries';
import { flattenPages, PagedResponse } from '@/util/helper/timeline';
import { useCommunityStream } from './useCommunityStream';

const MAX_TIMELINE_STATUSES = 130;
const THROTTLE_MERGE_INTERVAL = 2000;

export const useHomeFollowingTimeline = (
	visibleItemIndexRef: MutableRefObject<number>,
) => {
	const queryClient = useQueryClient();
	const { userOriginInstance, userInfo } = useAuthStore();
	const [isRefresh, setIsRefresh] = useState(false);

	const queryParams = {
		domain_name: userOriginInstance,
		remote: false,
		only_media: false,
	};

	const queryKey = useMemo(
		() => ['home-timeline', queryParams],
		[userOriginInstance],
	);

	const {
		data: activityTimeline,
		hasNextPage,
		fetchNextPage,
		isFetching,
		refetch,
	} = useGetHomeTimeline(queryParams);

	const incomingBuffer = useMemo<Patchwork.Status[]>(() => [], []);

	const flushBufferToCache = useMemo(
		() =>
			throttle(
				() => {
					if (incomingBuffer.length === 0) return;

					const itemsToMerge = [...incomingBuffer];
					incomingBuffer.length = 0;

					const currentIndex = visibleItemIndexRef.current || 0;
					const isAtTop = currentIndex <= 1;

					queryClient.setQueryData(
						queryKey,
						(
							oldData:
								| InfiniteData<PagedResponse<Patchwork.Status[]>>
								| undefined,
						) => {
							if (!oldData || !oldData.pages) return oldData;

							const newPages = [...oldData.pages];

							if (isAtTop) {
								if (newPages.length > 0) {
									newPages[0] = {
										...newPages[0],
										data: [...itemsToMerge, ...newPages[0].data],
									};
								}
							} else {
								let insertionGlobalIndex = currentIndex + 4;
								let itemsSkipped = 0;
								let inserted = false;

								for (let i = 0; i < newPages.length; i++) {
									const pageData = newPages[i].data;
									if (insertionGlobalIndex <= itemsSkipped + pageData.length) {
										const localIndex = insertionGlobalIndex - itemsSkipped;
										const newData = [...pageData];
										newData.splice(localIndex, 0, ...itemsToMerge);
										newPages[i] = { ...newPages[i], data: newData };
										inserted = true;
										break;
									}
									itemsSkipped += pageData.length;
								}

								if (!inserted && newPages.length > 0) {
									const lastIdx = newPages.length - 1;
									newPages[lastIdx] = {
										...newPages[lastIdx],
										data: [...newPages[lastIdx].data, ...itemsToMerge],
									};
								}
							}

							let totalCount = newPages.reduce(
								(acc, page) => acc + page.data.length,
								0,
							);

							if (totalCount > MAX_TIMELINE_STATUSES) {
								let itemsToRemove = totalCount - MAX_TIMELINE_STATUSES;

								for (let i = newPages.length - 1; i >= 0; i--) {
									if (itemsToRemove <= 0) break;

									const page = newPages[i];

									if (page.data.length <= itemsToRemove) {
										itemsToRemove -= page.data.length;
										newPages.splice(i, 1);
									} else {
										const newData = page.data.slice(
											0,
											page.data.length - itemsToRemove,
										);
										newPages[i] = { ...page, data: newData };
										itemsToRemove = 0;
									}
								}
							}

							return { ...oldData, pages: newPages };
						},
					);
				},
				THROTTLE_MERGE_INTERVAL,
				{ leading: true, trailing: true },
			),
		[queryClient, queryKey, incomingBuffer, visibleItemIndexRef],
	);

	useCommunityStream({
		autoConnect: true,
		streamName: 'user',
		onNewStatus: (status: Patchwork.Status) => {
			incomingBuffer.unshift(status);
			flushBufferToCache();
		},
	});

	const activityFlattenData = useMemo(
		() => flattenPages(activityTimeline) ?? [],
		[activityTimeline],
	);

	const handleRefresh = async () => {
		setIsRefresh(true);
		await refetch();
		delay(() => setIsRefresh(false), 1500);
	};

	const onActivityLoadMore = () => {
		if (hasNextPage && !isFetching) {
			fetchNextPage();
		}
	};

	return {
		activityFlattenData,
		userInfo,
		userOriginInstance,
		isFetching,
		isRefresh,
		handleRefresh,
		onActivityLoadMore,
	};
};
