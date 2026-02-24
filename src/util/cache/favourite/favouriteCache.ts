import {
	GetChannelFeedQueryKey,
	GetHomeTimelineQueryKey,
} from '@/types/queries/channel.type';
import {
	AccountDetailFeedQueryKey,
	GetTrendingStatusesQueryKey,
} from '@/types/queries/feed.type';

export type FavouriteQueryKeys =
	| GetChannelFeedQueryKey
	| AccountDetailFeedQueryKey
	| GetTrendingStatusesQueryKey
	| GetHomeTimelineQueryKey;

const toggleFavouriteState = (status: Patchwork.Status): Patchwork.Status => ({
	...status,
	favourited: !status.favourited,
	favourites_count: status.favourited
		? status.favourites_count - 1
		: status.favourites_count + 1,
});

export const updateStatusFavourite = (
	status: Patchwork.Status,
): Patchwork.Status => {
	if (status.reblog) {
		return {
			...status,
			reblog: toggleFavouriteState(status.reblog),
		};
	}
	return toggleFavouriteState(status);
};

export { toggleFavouriteState };
