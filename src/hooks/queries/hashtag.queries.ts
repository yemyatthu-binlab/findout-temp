import {
	getHashtagDetail,
	getHashtagsFollowing,
	searchAllFn,
	searchAllSpecificAccounts,
	trendingHashtagFn,
} from '@/services/hashtag.service';
import {
	HashtagDetailQueryKey,
	HashtagsFollowingQueryKey,
	SearchAllQueryKey,
	SearchAllSpecificQueryKey,
	TrendingHashtagQueryKey,
} from '@/types/queries/hashtag.type';
import { QueryOptionHelper } from '@/util/helper/helper';
import {
	InfiniteData,
	useInfiniteQuery,
	useQuery,
} from '@tanstack/react-query';

export const useHashTagDetailQuery = ({
	domain_name,
	hashtag,
}: HashtagDetailQueryKey[1]) => {
	const queryKey: HashtagDetailQueryKey = [
		'hashtag-detail',
		{ domain_name, hashtag },
	];
	return useQuery({ queryKey, queryFn: getHashtagDetail });
};

export const useTrendingHashTagsQueries = () => {
	const queryKey: TrendingHashtagQueryKey = ['trending-hashtags'];
	return useQuery({
		queryKey,
		queryFn: trendingHashtagFn,
		staleTime: 1000 * 60 * 3,
	});
};

export const useSearchAllQueries = ({
	options,
	...queryParam
}: SearchAllQueryKey[1] & {
	options?: QueryOptionHelper<Patchwork.SearchAll | undefined>;
}) => {
	const queryKey: SearchAllQueryKey = ['search-all', queryParam];
	return useQuery({
		queryKey,
		//@ts-expect-error
		queryFn: searchAllFn,
		...options,
	});
};

export const useSearchAccountsInfiniteQuery = ({
	options,
	...queryParam
}: SearchAllSpecificQueryKey[1] & {
	options?: QueryOptionHelper<Patchwork.SearchAll[] | undefined>;
}) => {
	const queryKey: SearchAllSpecificQueryKey = [
		'search-all-specific-accounts',
		queryParam,
	];
	return useInfiniteQuery<
		Patchwork.SearchAll,
		Error,
		InfiniteData<Patchwork.SearchAll>
	>({
		queryKey,
		// @ts-expect-error
		queryFn: ({ pageParam }: { pageParam: string | null }) =>
			searchAllSpecificAccounts({
				pageParam,
				searchedKeyword: queryParam.q,
			}),
		...options,
		getNextPageParam: (lastPage: Patchwork.SearchAll, allPages) => {
			const currentOffset = allPages.flatMap(p => p.accounts).length;
			const hasMore =
				lastPage?.accounts?.length === 10 && lastPage?.accounts?.length > 0;
			return hasMore ? currentOffset : undefined;
		},
	});
};

export const useGetHashtagsFollowing = ({
	options,
	...queryParam
}: HashtagsFollowingQueryKey[1] & {
	options?: QueryOptionHelper<Patchwork.HashtagsFollowing[] | undefined>;
}) => {
	const queryKey: HashtagsFollowingQueryKey = [
		'hashtags-following',
		queryParam,
	];
	return useQuery({
		queryKey,
		//@ts-expect-error
		queryFn: getHashtagsFollowing,
		retry: false,
		...options,
	});
};
