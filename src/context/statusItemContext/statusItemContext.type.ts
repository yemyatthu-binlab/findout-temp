export type StatusCurrentPage =
	| 'Channel'
	| 'Profile'
	| 'Hashtag'
	| 'FeedDetail'
	| 'ProfileOther'
	| 'Notification'
	| 'Compose'
	| 'BookmarkList'
	| 'Lists'
	| 'TrendingStatuses'
	| 'SearchedStatuses'
	| 'HomeTimeline'
	| 'MasdotonLocalTimeline'
	| 'NewsmastChannelTimeline'
	| 'QuotedBy';

export type StatusOrigin =
	| 'other'
	| 'noti'
	| 'hashtag'
	| 'trendingStatusTimeline'
	| 'homeTimeline';

export type StatusType =
	| 'normal'
	| 'reblog'
	| 'feedDetail'
	| 'reply'
	| 'reposting'
	| 'quoting'
	| 'notification'
	| 'channel-feed';
