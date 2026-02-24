import {
	acceptNotiReq,
	deleteMesssage,
	dismissNotiReq,
	markAsRead,
	readAllConversations,
} from '@/services/conversations.service';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useMarkAsReadMutation = (
	options?: UseMutationOptions<
		Patchwork.Conversations,
		AxiosError,
		{ id: string }
	>,
) => {
	return useMutation({ mutationFn: markAsRead, ...options });
};

export const useMessageDeleteMutation = (
	options?: UseMutationOptions<{}, AxiosError, { id: string }>,
) => {
	return useMutation({
		mutationFn: deleteMesssage,
		...options,
	});
};

export const useAcceptNotiReqMutation = (
	options?: UseMutationOptions<{}, AxiosError, { id: string }>,
) => {
	return useMutation({ mutationFn: acceptNotiReq, ...options });
};

export const useDismissNotiReqMutation = (
	options?: UseMutationOptions<{}, AxiosError, { id: string }>,
) => {
	return useMutation({ mutationFn: dismissNotiReq, ...options });
};

export const uesReadAllConversations = (
	options?: UseMutationOptions<
		{
			success: boolean;
			updated_count: string;
			message: string;
		},
		AxiosError,
		{}
	>,
) => {
	return useMutation({ mutationFn: readAllConversations, ...options });
};
