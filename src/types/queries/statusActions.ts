export type GetBookmarkListQueryKey = [
	'bookmark-list',
	{ domain_name: string; remote: boolean; only_media: boolean },
];

export type GetSpecificPollInfo = ['get-specific-poll-info', { id: string }];
