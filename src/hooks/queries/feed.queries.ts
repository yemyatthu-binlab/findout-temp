import {
	blockUnBlockUserMutationFn,
	fetchLinkPreview,
	getAccountDetailFeed,
	getAltTextSetting,
	getBoostedBy,
	getCustomEmojis,
	getFavoritedBy,
	getFeedDetail,
	getFeedReplies,
	getGifSearchResult,
	getHashtagDetailFeed,
	getMediaStatus,
	getQuotedBy,
	getScheduleList,
	getTrendingStatuses,
	muteUnMuteUserMutationFn,
	translationLanguagesFn,
	viewMultiDraft,
	viewSpecificDraft,
} from '@/services/feed.service';
import {
	checkEmailNotiSetting,
	getMuteUnMuteNotification,
} from '@/services/notification.service';
import { useManageAttachmentActions } from '@/store/compose/manageAttachments/manageAttachmentStore';
import {
	AccountDetailFeedQueryKey,
	AltTextSetting,
	CheckEmailNotiSettingQueryKey,
	CustomEmojisQueryKey,
	FeedDetailQueryKey,
	FeedRepliesQueryKey,
	GetBoostedByQueryKey,
	GetFavoritedByQueryKey,
	GetQuotedByQueryKey,
	GetScheduleListQueryKey,
	GetTrendingStatusesQueryKey,
	GifSearchQueryKey,
	HashtagDetailFeedQueryKey,
	LinkPreviewQueryKey,
	NotifiationMuteUnMuteQueryKey,
	TranslationLanguagesQueryKey,
	UserThemeSettingQueryKey,
	ViewMultiDraftQueryKey,
} from '@/types/queries/feed.type';
import { QueryOptionHelper } from '@/util/helper/helper';
import { infinitePageParam, PagedResponse } from '@/util/helper/timeline';
import {
	InfiniteData,
	QueryOptions,
	useInfiniteQuery,
	useMutation,
	UseMutationOptions,
	useQuery,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useFeedDetailQuery = ({
	options,
	...queryParam
}: FeedDetailQueryKey[1] & {
	options?: QueryOptionHelper<Patchwork.StatusDetail | undefined>;
}) => {
	const queryKey: FeedDetailQueryKey = ['feed-detail', queryParam];
	return useQuery({
		queryKey,
		//@ts-expect-error
		queryFn: getFeedDetail,
		...options,
	});
};

export const useFeedRepliesQuery = ({
	domain_name,
	id,
	options,
}: FeedRepliesQueryKey[1] & {
	options?: QueryOptionHelper<Patchwork.TimelineReplies | undefined>;
}) => {
	const queryKey: FeedRepliesQueryKey = ['feed-replies', { domain_name, id }];
	//@ts-expect-error
	return useQuery({ queryKey, queryFn: getFeedReplies, ...options });
};

export const useAccountDetailFeed = ({
	options,
	...queryParam
}: AccountDetailFeedQueryKey[1] & {
	options?: { enabled: boolean };
}) => {
	const queryKey: AccountDetailFeedQueryKey = [
		'account-detail-feed',
		queryParam,
	];
	return useInfiniteQuery<
		PagedResponse<Patchwork.Status[]>,
		Error,
		InfiniteData<PagedResponse<Patchwork.Status[]>>
	>({
		queryKey,
		...options,
		//@ts-expect-error
		queryFn: getAccountDetailFeed,
		...infinitePageParam,
	});
};

export const useHashtagDetailFeedQuery = (
	queryParam: HashtagDetailFeedQueryKey[1],
) => {
	const queryKey: HashtagDetailFeedQueryKey = [
		'hashtag-detail-feed',
		queryParam,
	];
	return useInfiniteQuery<
		PagedResponse<Patchwork.Status[]>,
		Error,
		InfiniteData<PagedResponse<Patchwork.Status[]>>
	>({
		queryKey,
		//@ts-expect-error
		queryFn: getHashtagDetailFeed,
		...infinitePageParam,
	});
};

export const useLinkPreviewQueries = ({
	url,
	enabled = false,
}: {
	url: string;
	enabled?: boolean;
}) => {
	const queryKey: LinkPreviewQueryKey = ['link-preview', { url }];
	return useQuery({ queryKey, queryFn: fetchLinkPreview, enabled, retry: 0 });
};

export const useMuteUnmuteUserMutation = (
	options: UseMutationOptions<
		Patchwork.RelationShip,
		AxiosError,
		{ accountId: string; toMute: boolean }
	>,
) => {
	return useMutation({ mutationFn: muteUnMuteUserMutationFn, ...options });
};

export const useBlockUnBlockUserMutation = (
	options: UseMutationOptions<
		Patchwork.RelationShip,
		AxiosError,
		{ accountId: string; toBlock: boolean }
	>,
) => {
	return useMutation({ mutationFn: blockUnBlockUserMutationFn, ...options });
};

export const useTranslationLanguagesQueries = () => {
	const queryKey: TranslationLanguagesQueryKey = ['translation-languages'];
	return useQuery({
		queryKey,
		queryFn: translationLanguagesFn,
		retry: false,
		staleTime: Infinity,
	});
};

export const useGetTrendingStatuses = (
	queryParam: GetTrendingStatusesQueryKey[1],
) => {
	const queryKey: GetTrendingStatusesQueryKey = [
		'trending-statuses',
		queryParam,
	];
	return useInfiniteQuery<
		PagedResponse<Patchwork.Status[]>,
		Error,
		InfiniteData<PagedResponse<Patchwork.Status[]>>
	>({
		queryKey,
		//@ts-expect-error
		queryFn: getTrendingStatuses,
		...infinitePageParam,
	});
};

export const useViewMultiDraft = (
	options?: QueryOptionHelper<Patchwork.MultiDraftStatusData[] | undefined>,
) => {
	const queryKey: ViewMultiDraftQueryKey = ['view-multi-draft'];
	return useQuery({ queryKey, queryFn: viewMultiDraft, ...options });
};

export const useViewSpecificDraft = (id: string, options?: QueryOptions) => {
	return useQuery<Patchwork.DraftStatusItem, AxiosError>({
		queryKey: ['view-specific-draft', id],
		//@ts-expect-error
		queryFn: () => viewSpecificDraft({ id }),
		enabled: !!id,
		...options,
	});
};

export const useGetScheduleList = (enabled?: boolean) => {
	const queryKey: GetScheduleListQueryKey = ['schedule-list'];
	return useQuery({
		queryKey,
		queryFn: getScheduleList,
		enabled,
	});
};

export const useGetNotificationMuteStatus = (enabled: boolean) => {
	const queryKey: NotifiationMuteUnMuteQueryKey = ['notification-mute-unmute'];
	return useQuery({
		queryKey,
		queryFn: getMuteUnMuteNotification,
		enabled,
		gcTime: Infinity,
	});
};

export const useSearchGif = (query: string) => {
	const queryKey: GifSearchQueryKey = ['gif-search', { query }];
	return useQuery({
		queryKey,
		queryFn: getGifSearchResult,
	});
};

export const useCheckEmailNotiSetting = ({
	options,
}: {
	options?: QueryOptionHelper<{ data: boolean } | undefined>;
}) => {
	const queryKey: CheckEmailNotiSettingQueryKey = ['check-email-noti-setting'];
	return useQuery({
		queryKey,
		queryFn: checkEmailNotiSetting,
		...options,
	});
};

export const useGetCustomEmojis = () => {
	const queryKey: CustomEmojisQueryKey = ['custom-emojis'];
	return useQuery({
		queryKey,
		queryFn: getCustomEmojis,
	});
};

export const useGetFavoritedBy = ({
	...queryParam
}: GetFavoritedByQueryKey[1]) => {
	const queryKey: GetFavoritedByQueryKey = ['favorited-by', queryParam];
	return useInfiniteQuery<
		PagedResponse<Patchwork.Account[]>,
		Error,
		InfiniteData<PagedResponse<Patchwork.Account[]>>
	>({
		queryKey,
		//@ts-expect-error
		queryFn: getFavoritedBy,
		...infinitePageParam,
	});
};

export const useGetBoostedBy = ({ ...queryParam }: GetBoostedByQueryKey[1]) => {
	const queryKey: GetBoostedByQueryKey = ['boosted-by', queryParam];
	return useInfiniteQuery<
		PagedResponse<Patchwork.Account[]>,
		Error,
		InfiniteData<PagedResponse<Patchwork.Account[]>>
	>({
		queryKey,
		//@ts-expect-error
		queryFn: getBoostedBy,
		...infinitePageParam,
	});
};

export const useGetQuotedBy = ({ ...queryParam }: GetQuotedByQueryKey[1]) => {
	const queryKey: GetQuotedByQueryKey = ['quoted-by', queryParam];
	return useInfiniteQuery<
		PagedResponse<Patchwork.Status[]>,
		Error,
		InfiniteData<PagedResponse<Patchwork.Status[]>>
	>({
		queryKey,
		//@ts-expect-error
		queryFn: getQuotedBy,
		...infinitePageParam,
	});
};

export const usePollMediaStatus = (
	mediaId: string | undefined,
	mediaIndex: number,
	isEnabled: boolean,
) => {
	const { onMediaProcessingComplete } = useManageAttachmentActions();

	return useQuery({
		queryKey: ['mediaStatus', mediaId],
		queryFn: async () => {
			if (!mediaId) return null;
			return getMediaStatus(mediaId);
		},
		// onSuccess: response => {
		// 	if (response && response.status === 200) {
		// 		onMediaProcessingComplete(mediaIndex, response.data);
		// 	}
		// },
		refetchInterval: query => {
			const status = query.state.data?.status;
			return status == 206 ? 3000 : false;
		},
		enabled: !!mediaId && isEnabled,
		refetchOnWindowFocus: false, // Prevents polling on window focus
		retry: false, // Prevents retrying on actual network errors
	});
};

export const useGetAltTextSetting = (enabled?: boolean) => {
	const queryKey: AltTextSetting = ['alt-text-setting'];
	return useQuery({
		queryKey: queryKey,
		queryFn: getAltTextSetting,
		enabled,
	});
};
