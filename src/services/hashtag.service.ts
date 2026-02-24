import {
	HashtagDetailQueryKey,
	HashtagsFollowingQueryKey,
	SearchAllQueryKey,
	SearchAllSpecificQueryKey,
} from '@/types/queries/hashtag.type';
import { QueryFunctionContext } from '@tanstack/react-query';
import instance from './instance';
import { AxiosResponse } from 'axios';
import { appendApiVersion, handleError } from '@/util/helper/helper';

export const getHashtagDetail = async (
	qfContext: QueryFunctionContext<HashtagDetailQueryKey>,
) => {
	const { hashtag, domain_name } = qfContext.queryKey[1];
	const resp: AxiosResponse<Patchwork.HashtagDetail> = await instance.get(
		appendApiVersion(`tags/${hashtag}`),
		{
			params: { domain_name, isDynamicDomain: true },
		},
	);
	return resp.data;
};

export const trendingHashtagFn = async () => {
	try {
		const resp: AxiosResponse<Patchwork.HashtagDetail[]> = await instance.get(
			appendApiVersion('trends/tags'),
		);
		return resp.data;
	} catch (error) {
		return handleError(error);
	}
};

export const searchAllFn = async ({
	queryKey,
}: QueryFunctionContext<SearchAllQueryKey>) => {
	try {
		const [, params] = queryKey;
		const response: AxiosResponse<Patchwork.SearchAll> = await instance.get(
			appendApiVersion('search', 'v2'),
			{ params },
		);
		return response.data;
	} catch (e) {
		return handleError(e);
	}
};

export const searchAllSpecificAccounts = async ({
	pageParam = null,
	searchedKeyword,
}: {
	pageParam?: string | null;
	searchedKeyword: string;
}): Promise<Patchwork.SearchAll> => {
	const response: AxiosResponse<Patchwork.SearchAll> = await instance.get(
		appendApiVersion('search', 'v2'),
		{
			params: {
				q: searchedKeyword,
				offset: pageParam,
				limit: 10,
				type: 'accounts',
				resolve: true,
			},
		},
	);

	return response.data;
};

export const getHashtagsFollowing = async (
	qfContext: QueryFunctionContext<HashtagsFollowingQueryKey>,
) => {
	const { limit, domain_name } = qfContext.queryKey[1];
	const resp: AxiosResponse<Patchwork.HashtagsFollowing> = await instance.get(
		appendApiVersion(`followed_tags`),
		{
			params: { domain_name, isDynamicDomain: true, limit },
		},
	);
	return resp.data;
};
