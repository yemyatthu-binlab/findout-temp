import { queryClient } from '@/App';
import { GetChannelFeedQueryKey } from '@/types/queries/channel.type';
import { AccountDetailFeedQueryKey } from '@/types/queries/feed.type';
import { HashtagDetailQueryKey } from '@/types/queries/hashtag.type';
import { DEFAULT_API_URL } from '@/util/constant';

export type PollCacheQueryKeys =
	| GetChannelFeedQueryKey
	| AccountDetailFeedQueryKey;

type UpdatePollCacheParams = {
	response: Patchwork.Status['poll'];
	selectedIndices: Set<number>;
	queryKeys: PollCacheQueryKeys[];
};

const updatePollStatus = (
	status: Patchwork.Status,
	selectedIndices: Set<number>,
): Patchwork.Status => ({
	...status,
	poll: {
		...status.poll,
		voted: true,
		own_votes: Array.from(selectedIndices),
		options: status.poll.options.map((option, index) => ({
			...option,
			votes_count: selectedIndices.has(index)
				? option.votes_count + 1
				: option.votes_count,
		})),
		votes_count: status.poll.votes_count + selectedIndices.size,
		voters_count: status.poll.voters_count + 1,
	},
});

const updateFeedQueryCache = (
	data: IFeedQueryFnData,
	response: Patchwork.Status['poll'],
	selectedIndices: Set<number>,
) => ({
	...data,
	pages: data.pages.map(page => ({
		...page,
		data: page.data.map(status => {
			if (status.poll === null && status.reblog?.poll?.id === response?.id) {
				return {
					...status,
					reblog: {
						...status.reblog,
						poll: response,
					},
				};
			} else if (status.poll?.id === response.id) {
				return updatePollStatus(status, selectedIndices);
			}
			return status;
		}),
	})),
});

export { updatePollStatus };
