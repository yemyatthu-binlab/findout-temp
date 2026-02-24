import { queryClient } from '@/App';
import { StatusDetailQueryKey } from '@/types/queries/feed.type';
import { updateStatusFavourite } from '../favourite/favouriteCache';
import {
	updateBlock,
	updateBookmark,
	updatedTranslate,
	updateMute,
	updateReply,
	updateRepost,
	updateStatusAsDeleted,
} from '@/util/helper/feed';
import { resetPassword } from '@/services/auth.service';
import { updatePollStatus } from '../poll/pollCache';
import { InfiniteData } from '@tanstack/react-query';
import { PagedResponse } from '@/util/helper/timeline';

export const generateQueryCacheForEachStatus = (
	statuses: Patchwork.Status[],
) => {
	statuses.forEach(status => {
		queryClient.setQueryData(['status', { id: status.id }], status);
	});
};

export const updateStatusFaouriteCache = (status: Patchwork.Status) => {
	const queryKey: StatusDetailQueryKey = ['status', { id: status.id }];

	const previousData = queryClient.getQueryData<Patchwork.Status>(queryKey);

	if (!previousData) return;

	const updatedData = updateStatusFavourite(previousData);
	queryClient.setQueryData(queryKey, updatedData);
};

export const updateStatusReplyCache = (
	id: string,
	operationType: 'increase' | 'decrease',
) => {
	const queryKey: StatusDetailQueryKey = ['status', { id }];

	const previousData = queryClient.getQueryData<Patchwork.Status>(queryKey);

	if (!previousData) return;

	const updatedData = updateReply(previousData, operationType);
	queryClient.setQueryData(queryKey, updatedData);
};

export const updateStatusRepostCache = (
	id: string,
	operationType: 'increase' | 'decrease',
) => {
	const queryKey: StatusDetailQueryKey = ['status', { id }];

	const previousData = queryClient.getQueryData<Patchwork.Status>(queryKey);

	if (!previousData) return;

	const updatedData = updateRepost(previousData, operationType);
	queryClient.setQueryData(queryKey, updatedData);
};

export const updateStatusBookmarkCache = (id: string) => {
	const queryKey: StatusDetailQueryKey = ['status', { id }];

	const previousData = queryClient.getQueryData<Patchwork.Status>(queryKey);

	if (!previousData) return;

	const updatedData = updateBookmark(previousData);
	queryClient.setQueryData(queryKey, updatedData);
};

export const editStatusCache = (status: Patchwork.Status) => {
	const queryKey: StatusDetailQueryKey = ['status', { id: status.id }];

	const previousData = queryClient.getQueryData<Patchwork.Status>(queryKey);

	if (!previousData) return;

	queryClient.setQueryData(queryKey, status);
};

export const addStatusToFeedCacheHelper = (
	queryKeys: any[],
	status: Patchwork.Status,
) => {
	queryKeys.forEach(queryKey => {
		queryClient.setQueryData(
			queryKey,
			(
				oldData: InfiniteData<PagedResponse<Patchwork.Status[]>> | undefined,
			) => {
				if (!oldData) return oldData;

				return {
					...oldData,
					pages: oldData.pages.map((page, index) => {
						if (index === 0) {
							return {
								...page,
								data: [status, ...(page.data ?? [])],
							};
						}
						return page;
					}),
				};
			},
		);
	});
};

export const deleteStatusCache = (id: string) => {
	const queryKey: StatusDetailQueryKey = ['status', { id }];

	const previousData = queryClient.getQueryData<Patchwork.Status>(queryKey);

	if (!previousData) return;
	const updatedData = updateStatusAsDeleted(previousData);
	queryClient.setQueryData(queryKey, updatedData);
};

export const updateTranslateCache = (
	status: Patchwork.Status,
	response: { content: string; statusId: string },
	showTranslatedText: boolean,
) => {
	const queryKey: StatusDetailQueryKey = ['status', { id: status.id }];
	const previousData = queryClient.getQueryData<Patchwork.Status>(queryKey);
	if (!previousData) return;
	const updatedData = updatedTranslate(status, response, showTranslatedText);
	queryClient.setQueryData(queryKey, updatedData);
};

export const updateMuteCache = (status: Patchwork.Status) => {
	const queryKey: StatusDetailQueryKey = ['status', { id: status.id }];
	const previousData = queryClient.getQueryData<Patchwork.Status>(queryKey);
	if (!previousData) return;
	const updatedData = updateMute(status);
	queryClient.setQueryData(queryKey, updatedData);
};

export const updateBlockCache = (status: Patchwork.Status) => {
	const queryKey: StatusDetailQueryKey = ['status', { id: status.id }];
	const previousData = queryClient.getQueryData<Patchwork.Status>(queryKey);
	if (!previousData) return;
	const updatedData = updateBlock(status);
	queryClient.setQueryData(queryKey, updatedData);
};

export const updateShowAllHashtagCache = (
	status: Patchwork.Status,
	showAll: boolean,
) => {
	const queryKey: StatusDetailQueryKey = ['status', { id: status.id }];
	const previousData = queryClient.getQueryData<Patchwork.Status>(queryKey);
	if (!previousData) return;

	const updatedData = {
		...status,
		custom: { ...status.custom, isHashtagExpanded: showAll },
	};
	queryClient.setQueryData(queryKey, updatedData);
};

export const updateShowAllLongPostCache = (status: Patchwork.Status) => {
	const queryKey: StatusDetailQueryKey = ['status', { id: status.id }];
	const previousData = queryClient.getQueryData<Patchwork.Status>(queryKey);
	if (!previousData) return;

	const updatedData = {
		...status,
		custom: { ...status.custom, isLongPost: true },
	};

	queryClient.setQueryData(queryKey, updatedData);
};

export const updateSensitiveImageCache = (
	statusId: string,
	attachment: Patchwork.Attachment,
) => {
	const queryKey: StatusDetailQueryKey = ['status', { id: statusId }];
	const previousData = queryClient.getQueryData<Patchwork.Status>(queryKey);
	if (!previousData) return;

	const updatedData = {
		...previousData,
		media_attachments: previousData.media_attachments.map(item =>
			item.id === attachment.id ? { ...item, sensitive: true } : item,
		),
	};

	queryClient.setQueryData(queryKey, updatedData);
};

export const updateShowAltTextModalCache = (
	statusId: string,
	attachment: Patchwork.Attachment,
	isShowAltTextModal: boolean,
) => {
	const queryKey: StatusDetailQueryKey = ['status', { id: statusId }];
	const previousData = queryClient.getQueryData<Patchwork.Status>(queryKey);
	if (!previousData) return;

	const updatedData = {
		...previousData,
		media_attachments: previousData.media_attachments.map(item =>
			item.id === attachment.id
				? { ...item, custom: { isShowAltTextModal: isShowAltTextModal } }
				: item,
		),
	};

	queryClient.setQueryData(queryKey, updatedData);
};

export const updateStatusPollCache = (
	id: string,
	selectedIndices: Set<number>,
) => {
	const queryKey: StatusDetailQueryKey = ['status', { id }];

	const previousData = queryClient.getQueryData<Patchwork.Status>(queryKey);

	if (!previousData) return;

	const updatedData = updatePollStatus(previousData, selectedIndices);
	queryClient.setQueryData(queryKey, updatedData);
};

export const updateStatusPollCacheOnRefresh = (
	id: string,
	pollResult: Patchwork.Poll,
) => {
	const queryKey: StatusDetailQueryKey = ['status', { id }];
	const previousData = queryClient.getQueryData<Patchwork.Status>(queryKey);
	if (!previousData) return;

	const updatedData: Patchwork.Status = {
		...previousData,
		poll: pollResult,
	};

	queryClient.setQueryData(queryKey, updatedData);
};

export const toggleForceShowSpoilerTextCache = (
	status: Patchwork.Status,
	forceShowSensitiveContent: boolean,
) => {
	const queryKey: StatusDetailQueryKey = ['status', { id: status.id }];

	const previousData = queryClient.getQueryData<Patchwork.Status>(queryKey);

	if (!previousData) return;

	const updatedData: Patchwork.Status = {
		...previousData,
		custom: { ...previousData.custom, forceShowSensitiveContent },
	};
	queryClient.setQueryData(queryKey, updatedData);
};

export const forceHideStatus = (status: Patchwork.Status) => {
	const queryKey: StatusDetailQueryKey = ['status', { id: status.id }];

	const previousData = queryClient.getQueryData<Patchwork.Status>(queryKey);

	if (!previousData) return;

	const updatedData: Patchwork.Status = {
		...previousData,
		custom: { ...previousData.custom, forceHideStatus: true },
	};
	queryClient.setQueryData(queryKey, updatedData);
};

export const changeOwnerQuoteStatusCount = (
	status: Patchwork.Status,
	operation: 'increase' | 'decrease',
) => {
	const queryKey: StatusDetailQueryKey = ['status', { id: status.id }];
	const previousData = queryClient.getQueryData<Patchwork.Status>(queryKey);

	if (!previousData) return;

	const delta = operation === 'increase' ? 1 : -1;

	const nextCount = Math.max(0, (previousData?.quotes_count ?? 0) + delta);

	const updatedData: Patchwork.Status = {
		...previousData,
		quotes_count: nextCount,
	};

	queryClient.setQueryData(queryKey, updatedData);
};

export const toggleForceShowHiddenQuoteCache = (
	status: Patchwork.Status,
	forceShowHiddenQuote: boolean,
) => {
	const queryKey: StatusDetailQueryKey = ['status', { id: status.id }];

	const previousData = queryClient.getQueryData<Patchwork.Status>(queryKey);

	if (!previousData) return;

	const updatedData: Patchwork.Status = {
		...previousData,
		custom: { ...previousData.custom, forceShowHiddenQuote },
	};
	queryClient.setQueryData(queryKey, updatedData);
};

export function updateStatusAfterRevokeQuote(revokedStatus: Patchwork.Status) {
	const quotingKey: StatusDetailQueryKey = ['status', { id: revokedStatus.id }];
	queryClient.setQueryData(quotingKey, revokedStatus);
}

export const rehideSensitiveImageCache = (
	statusId: string,
	attachment: Patchwork.Attachment,
) => {
	const queryKey: StatusDetailQueryKey = ['status', { id: statusId }];
	const previousData = queryClient.getQueryData<Patchwork.Status>(queryKey);
	if (!previousData) return;

	const updatedData: Patchwork.Status = {
		...previousData,
		media_attachments: previousData.media_attachments.map(item =>
			item.id === attachment.id ? { ...item, sensitive: false } : item,
		),
	};

	queryClient.setQueryData(queryKey, updatedData);
};
