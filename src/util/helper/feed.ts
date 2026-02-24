import { stat } from 'fs';

type PageKey =
	| 'Hashtag'
	| 'BookmarkList'
	| 'TrendingStatuses'
	| 'Lists'
	| 'HomeTimeline'
	| 'ProfileOther'
	| 'Notification';

type ComeFromValue =
	| 'other'
	| 'noti'
	| 'hashtag'
	| 'bookmarkList'
	| 'profile'
	| 'profileOther'
	| 'trendingStatusTimeline'
	| 'lists'
	| 'homeTimeline';

const pageToComeFrom: Record<PageKey, ComeFromValue> = {
	Hashtag: 'hashtag',
	BookmarkList: 'bookmarkList',
	TrendingStatuses: 'trendingStatusTimeline',
	Lists: 'lists',
	HomeTimeline: 'homeTimeline',
	ProfileOther: 'other',
	Notification: 'noti',
};

export function getComeFromByPage(page: string): ComeFromValue | undefined {
	return pageToComeFrom[page as PageKey];
}

export const updateReply = (
	status: Patchwork.Status,
	operationType: 'increase' | 'decrease',
): Patchwork.Status => {
	if (status.reblog) {
		return {
			...status,
			reblog: {
				...status.reblog,
				replies_count:
					status.reblog.replies_count + (operationType === 'increase' ? 1 : -1),
			},
		};
	}
	return {
		...status,
		replies_count:
			status.replies_count + (operationType === 'increase' ? 1 : -1),
	};
};

export const updateRepost = (
	status: Patchwork.Status,
	operationType: 'increase' | 'decrease',
): Patchwork.Status => {
	if (status.reblog) {
		return {
			...status,
			reblog: {
				...status.reblog,
				reblogs_count:
					status.reblog.reblogs_count + (operationType === 'increase' ? 1 : -1),
				reblogged: operationType === 'increase',
			},
		};
	}
	return {
		...status,
		reblogs_count:
			status.reblogs_count + (operationType === 'increase' ? 1 : -1),
		reblogged: operationType === 'increase',
	};
};

export const updateBookmark = (status: Patchwork.Status): Patchwork.Status => {
	if (status.reblog) {
		return {
			...status,
			reblog: {
				...status.reblog,
				bookmarked: !status.bookmarked,
			},
		};
	}
	return {
		...status,
		bookmarked: !status.bookmarked,
	};
};

export const updateStatusAsDeleted = (
	status: Patchwork.Status,
): Patchwork.Status => {
	return {
		...status,
		isDeleted: true,
	};
};

export const updatedTranslate = (
	status: Patchwork.Status,
	response: { content: string; statusId: string },
	showTranslatedText: boolean,
): Patchwork.Status => {
	if (showTranslatedText) {
		return {
			...status,
			translated_text: response.content,
		};
	} else {
		return {
			...status,
			content: status.content,
			translated_text: '',
		};
	}
};

export const updateMute = (status: Patchwork.Status) => {
	return {
		...status,
		isMuted: true,
	};
};
export const updateBlock = (status: Patchwork.Status) => {
	return {
		...status,
		isBlocked: true,
	};
};
