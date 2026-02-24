import {
	bookmarkStatus,
	revokeQuote,
	statusDeleteFn,
} from '@/services/statusActions.service';
import {
	MutationOptions,
	UseMutationOptions,
	useMutation,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useStatusDeleteMutation = (
	options: UseMutationOptions<
		Patchwork.Status,
		AxiosError,
		{
			status_id: Patchwork.Status['id'];
		}
	>,
) => {
	return useMutation({ mutationFn: statusDeleteFn, ...options });
};

export const useBookmarkStatusMutation = (
	options: MutationOptions<
		Patchwork.Status,
		AxiosError,
		{ status: Patchwork.Status }
	>,
) => {
	return useMutation({ mutationFn: bookmarkStatus, ...options });
};

export const useRevokeQuoteMutation = (
	options?: UseMutationOptions<
		Patchwork.Status,
		AxiosError,
		{ quotedStatusId: string; quotingStatusId: string }
	>,
) => {
	return useMutation({ mutationFn: revokeQuote, ...options });
};
