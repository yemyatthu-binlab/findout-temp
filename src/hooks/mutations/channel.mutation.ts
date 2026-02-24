import {
	addFilterInOutKeyword,
	createChannelHashtag,
	removeOrUpdateFilterKeyword,
	removeOrUpdateHashtag,
	updateChannelContentType,
	updateChannelPostType,
	deleteFavouriteChannelMutationFn,
	favouriteChannelMutationFn,
	setPrimaryChannel,
} from '@/services/channel.service';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useCreateChannelHashtagMutation = (
	options: UseMutationOptions<
		{ message: string },
		AxiosError,
		{
			hashtag: string;
			channelId: string;
		}
	>,
) => {
	return useMutation({ mutationFn: createChannelHashtag, ...options });
};

export const useFilterInOutMutation = (
	options: UseMutationOptions<
		{ message: string },
		AxiosError,
		{
			keyword: string;
			channelId: string;
			is_filter_hashtag: boolean;
			filter_type: 'filter_in' | 'filter_out';
		}
	>,
) => {
	return useMutation({ mutationFn: addFilterInOutKeyword, ...options });
};

export const useRemoveOrUpdateFilterKeyword = (
	options: UseMutationOptions<
		{ message: string },
		AxiosError,
		{
			keyword: string;
			channelId: string;
			keywordId: string;
			filter_type: 'filter_in' | 'filter_out';
			operation: 'edit' | 'delete';
			is_filter_hashtag: boolean;
		}
	>,
) => {
	return useMutation({ mutationFn: removeOrUpdateFilterKeyword, ...options });
};

export const useRemoveOrUpdateHashtag = (
	options: UseMutationOptions<
		{ message: string },
		AxiosError,
		{
			hashtag: string;
			channelId: string;
			hashtagId: string;
			operation: 'edit' | 'delete';
		}
	>,
) => {
	return useMutation({ mutationFn: removeOrUpdateHashtag, ...options });
};

export const useChangeChannelContentType = (
	options: UseMutationOptions<
		{ data: Patchwork.ChannelContentAttribute },
		AxiosError,
		{
			channel_type: string;
			custom_condition: 'and_condition' | 'or_condition';
			patchwork_community_id: string;
		}
	>,
) => {
	return useMutation({ mutationFn: updateChannelContentType, ...options });
};

export const useChangeChannelPostsType = (
	options: UseMutationOptions<
		{ message: string },
		AxiosError,
		{
			posts: boolean;
			reposts: boolean;
			replies: boolean;
			channelId: string;
		}
	>,
) => {
	return useMutation({ mutationFn: updateChannelPostType, ...options });
};

export const useFavouriteChannelMutation = (
	options: UseMutationOptions<
		{ message: string },
		AxiosError,
		{ id: string; isNewsmastChannel?: boolean }
	>,
) => {
	return useMutation({ mutationFn: favouriteChannelMutationFn, ...options });
};

export const useDeleteFavouriteChannelMutation = (
	options: UseMutationOptions<
		{ message: string },
		AxiosError,
		{ id: string; isNewsmastChannel?: boolean }
	>,
) => {
	return useMutation({
		mutationFn: deleteFavouriteChannelMutationFn,
		...options,
	});
};

export const useSetPrimaryAChannel = (
	options: UseMutationOptions<{ message: string }, AxiosError, { id: string }>,
) => {
	return useMutation({
		mutationFn: setPrimaryChannel,
		...options,
	});
};
