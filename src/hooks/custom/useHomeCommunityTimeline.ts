import { useCallback, useMemo, useState, MutableRefObject } from 'react';
import { useQueryClient, InfiniteData } from '@tanstack/react-query';
import { throttle, delay } from 'lodash';
import { useAuthStore } from '@/store/auth/authStore';
import { useGetChannelFeed } from '@/hooks/queries/channel.queries';
import { flattenPages, PagedResponse } from '@/util/helper/timeline';
import { useCommunityStream } from './useCommunityStream';

const MAX_TIMELINE_STATUSES = 130;
const THROTTLE_MERGE_INTERVAL = 1000;

export const useHomeCommunityTimeline = (
	visibleItemIndexRef: MutableRefObject<number>,
) => {
	const queryClient = useQueryClient();
	const { userOriginInstance, userInfo } = useAuthStore();

	const [isRefresh, setIsRefresh] = useState(false);

	const queryParams = {
		domain_name: userOriginInstance,
		only_media: false,
		remote: false,
		local: true,
	};

	const queryKey = useMemo(
		() => ['channel-feed', queryParams],
		[userOriginInstance],
	);

	const {
		data: activityTimeline,
		hasNextPage,
		fetchNextPage,
		isFetching,
		refetch,
	} = useGetChannelFeed(queryParams);

	// --- THE INJECTION LOGIC ---
	const incomingBuffer = useMemo<Patchwork.Status[]>(() => [], []);

	const flushBufferToCache = useMemo(
		() =>
			throttle(
				() => {
					if (incomingBuffer.length === 0) return;

					const itemsToMerge = [...incomingBuffer];
					incomingBuffer.length = 0;

					// Get the current user position from the Ref (0 = Top)
					const currentIndex = visibleItemIndexRef.current || 0;
					const isAtTop = currentIndex <= 1;

					queryClient.setQueryData(
						queryKey,
						(
							oldData:
								| InfiniteData<PagedResponse<Patchwork.Status[]>>
								| undefined,
						) => {
							if (!oldData) return oldData;

							const newPages = [...oldData.pages];

							// We need to inject items into the pages structure.
							// To simplify, we will operate on the FIRST page if at top,
							// or find the specific page if scrolled.

							// For simplicity and stability, we usually merge into Page 0.
							// However, to support "Insert Below Viewport", we need to be clever.

							if (isAtTop) {
								const oldFirstPage = newPages[0];
								newPages[0] = {
									...oldFirstPage,
									data: [...itemsToMerge, ...oldFirstPage.data],
								};
							} else {
								// --- SCENARIO B: User is Scrolling ---
								// We want to insert AFTER the current view.
								// We target index + 2 (so it appears slightly below the screen)

								// We have to find which "Page" holds the insertion point.
								let insertionGlobalIndex = currentIndex + 3;
								let itemsSkipped = 0;

								for (let i = 0; i < newPages.length; i++) {
									const pageData = newPages[i].data;

									// If the insertion point is within this page
									if (insertionGlobalIndex <= itemsSkipped + pageData.length) {
										const localIndex = insertionGlobalIndex - itemsSkipped;

										// Splice the new items into this specific page
										const newData = [...pageData];
										newData.splice(localIndex, 0, ...itemsToMerge);

										newPages[i] = { ...newPages[i], data: newData };
										break; // Done inserting
									}

									itemsSkipped += pageData.length;

									// Edge case: If we went past the last page (user is at very bottom)
									if (i === newPages.length - 1) {
										newPages[i] = {
											...newPages[i],
											data: [...newPages[i].data, ...itemsToMerge],
										};
									}
								}
							}

							// --- DEDUPLICATION & CLEANUP ---
							// Flatten temporarily to dedupe global IDs, then we assume page structure is roughly okay
							// Note: Strictly maintaining page structure while deduping is hard.
							// We will just dedupe the specific page we touched to be safe,
							// or rely on the KeyExtractor to handle minor duplicates in UI.

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
