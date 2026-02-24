import { queryClient } from '@/App';
import { QueryKey } from '@tanstack/react-query';
import { DEFAULT_API_URL } from '../constant';
import { GetChannelFeedQueryKey } from '@/types/queries/channel.type';
import { AccountDetailFeedQueryKey } from '@/types/queries/feed.type';

export type StatusCacheQueryKeys =
	| GetChannelFeedQueryKey
	| AccountDetailFeedQueryKey;

export const updateQueryCacheGeneric = <T>(
	queryKey: QueryKey,
	getUpdatedData: (previousData: T) => T,
) => {
	const previousData = queryClient.getQueryData<T>(queryKey);
	if (!previousData) return;

	const updatedData = getUpdatedData(previousData);

	queryClient.setQueryData(queryKey, updatedData);
};

export const getCacheQueryKeys = <T>(
	accountId: string,
	inReplyToId?: string | null,
	inReplyToAcctId?: string | null,
	isReblogged?: boolean,
	current_domain?: string,
): T[] => {
	const domain_name = current_domain || process.env.API_URL || DEFAULT_API_URL;
	return [
		['channel-feed', { domain_name, remote: false, only_media: false }],
		[
			'account-detail-feed',
			{
				domain_name,
				account_id: accountId,
				exclude_replies: false,
				exclude_reblogs: true,
				exclude_original_statuses: true,
			},
		],
		[
			'account-detail-feed',
			{
				domain_name,
				account_id: accountId,
				exclude_replies: true,
				exclude_reblogs: false,
				exclude_original_statuses: false,
			},
		],
	] as T[];
};
