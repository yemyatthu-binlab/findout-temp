import { DEFAULT_API_URL } from '@/util/constant';
import { create } from 'zustand';
type FDExtraPayloadType =
	| {
			comeFrom:
				| 'other'
				| 'noti'
				| 'hashtag'
				| 'bookmarkList'
				| 'profile'
				| 'profileOther'
				| 'trendingStatusTimeline'
				| 'lists'
				| 'homeTimeline'
				| 'channel';
			carriedPayload?: Record<string, any>;
	  }
	| undefined;

type ActiveFeedState = {
	activeFeed: Patchwork.Status | undefined;
	extraPayload: FDExtraPayloadType;
	actions: {
		setActiveFeed: (feed: Patchwork.Status) => void;
		changeActiveFeedReplyCount: (
			operationType: 'increase' | 'decrease',
		) => void;
		setFeedDetailExtraPayload: (payload: FDExtraPayloadType) => void;
		clearFeed: () => void;
	};
};

export const useActiveFeedStore = create<ActiveFeedState>()(set => ({
	activeFeed: undefined,
	extraPayload: undefined,
	actions: {
		setActiveFeed: feed => set(state => ({ ...state, activeFeed: feed })),
		clearFeed: () =>
			set(state => ({
				...state,
				activeFeed: undefined,
				extraPayload: undefined,
			})),
		changeActiveFeedReplyCount: operationType =>
			set(state => {
				if (state.activeFeed) {
					return {
						activeFeed: {
							...state.activeFeed,
							replies_count:
								operationType == 'increase'
									? state.activeFeed.replies_count + 1
									: state.activeFeed.replies_count - 1,
						},
					};
				}
				return state;
			}),
		setFeedDetailExtraPayload: payload =>
			set(state => ({ ...state, extraPayload: payload })),
	},
}));

export const useCurrentActiveFeed = () =>
	useActiveFeedStore(state => state.activeFeed);

export const useActiveFeedAction = () =>
	useActiveFeedStore(state => state.actions);
