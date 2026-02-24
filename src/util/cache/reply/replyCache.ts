import { queryClient } from '@/App';
import {
	GroupedNotificationsQueryKey,
	INotificationResponse,
	NormalNotificationQueryKey,
} from '@/services/notification.service';
import { useAuthStore } from '@/store/auth/authStore';
import { useActiveFeedStore } from '@/store/feed/activeFeed';
import { GetHomeTimelineQueryKey } from '@/types/queries/channel.type';
import {
	FeedRepliesQueryKey,
	GetTrendingStatusesQueryKey,
} from '@/types/queries/feed.type';
import { GetBookmarkListQueryKey } from '@/types/queries/statusActions';
import { DEFAULT_API_URL } from '@/util/constant';
import { updateReplyCountInFeed } from '@/util/helper/compose';
import { PagedResponse } from '@/util/helper/timeline';
import { InfiniteData } from '@tanstack/react-query';
import { cloneDeep, get, set, times } from 'lodash';

export const updateReplyFeedCache = (
	feedReplyQueryKey: FeedRepliesQueryKey,
	newStatus: Patchwork.Status,
	feedDetailStatusId: string,
) => {
	queryClient.setQueryData<Patchwork.TimelineReplies>(
		feedReplyQueryKey,
		oldData => {
			const { domain_name } = feedReplyQueryKey[1];
			const default_domain = process.env.API_URL ?? DEFAULT_API_URL;
			if (!oldData) return oldData;

			if (
				newStatus.in_reply_to_id == feedDetailStatusId &&
				domain_name == default_domain
			) {
				return {
					...oldData,
					descendants: [...oldData.descendants, newStatus],
				};
			} else {
				queryClient.invalidateQueries({ queryKey: feedReplyQueryKey });
				return oldData;
			}
		},
	);
};
