export type HashtagDetailQueryKey = [
	'hashtag-detail',
	{ hashtag: string; domain_name: string },
];

export type TrendingHashtagQueryKey = ['trending-hashtags'];

export type SearchAllQueryParam = {
	q: string;
	resolve?: boolean;
	limit?: number;
	type?: 'accounts' | 'hashtags';
	offset?: number;
};

export type SearchAllQueryKey = ['search-all', SearchAllQueryParam];

export type SearchAllSpecificQueryKey = [
	'search-all-specific-accounts',
	{ q: string },
];

export type HashtagsFollowingQueryKey = [
	'hashtags-following',
	{ limit?: number; domain_name: string },
];
