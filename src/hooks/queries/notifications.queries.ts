import {
	FollowRequestQueryKey,
	GroupedNotificationsQueryKey,
	INotificationResponse,
	MentionsNotificationsQueryKey,
	NormalNotificationQueryKey,
	getFollowRequests,
	getGroupedNotification,
	getMentionsNotifications,
	getNormalNotification,
	getNotificationMarker,
} from '@/services/notification.service';
import { NotificationMarkerQueryKey } from '@/types/queries/feed.type';
import { infinitePageParam, PagedResponse } from '@/util/helper/timeline';
import {
	InfiniteData,
	useInfiniteQuery,
	useQuery,
} from '@tanstack/react-query';

export const useGetGroupedNotification = () => {
	const queryKey: GroupedNotificationsQueryKey = ['get-grouped-notification'];
	return useInfiniteQuery<
		Patchwork.GroupedNotificationResults,
		Error,
		InfiniteData<PagedResponse<Patchwork.GroupedNotificationResults[]>>,
		GroupedNotificationsQueryKey
	>({
		queryKey,
		// @ts-expect-error
		queryFn: ctx => getGroupedNotification(ctx),
		...infinitePageParam,
	});
};

export const useGetNormalNotification = () => {
	const queryKey: NormalNotificationQueryKey = ['get-normal-notification'];
	return useInfiniteQuery<
		PagedResponse<INotificationResponse[]>,
		Error,
		InfiniteData<PagedResponse<INotificationResponse[]>>
	>({
		queryKey,
		//@ts-expect-error
		queryFn: ctx => getNormalNotification(ctx),
		...infinitePageParam,
	});
};

export const useMentionsNotifications = () => {
	const queryKey: MentionsNotificationsQueryKey = ['mention-noti-query-key'];
	return useQuery({
		queryKey,
		queryFn: getMentionsNotifications,
	});
};

export const useFollowRequestNotifications = () => {
	const queryKey: FollowRequestQueryKey = ['follow-request-query-key'];
	return useInfiniteQuery<
		PagedResponse<Patchwork.Account[]>,
		Error,
		InfiniteData<PagedResponse<Patchwork.Account[]>>
	>({
		queryKey,
		//@ts-expect-error
		queryFn: getFollowRequests,
		...infinitePageParam,
	});
};

export const useGetNotificationMarker = () => {
	const queryKey: NotificationMarkerQueryKey = ['notification-marker'];
	return useQuery({
		queryKey,
		queryFn: getNotificationMarker,
	});
};
