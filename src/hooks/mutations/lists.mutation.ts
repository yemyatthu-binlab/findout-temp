import {
	upsertListFn,
	listsDeleteFn,
	removeAccountFromListFn,
	addAccountToListFn,
} from '@/services/lists.service';
import { UpsertListMutationPayload } from '@/types/queries/lists.type';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useUpsertListsMutation = (
	options: UseMutationOptions<
		Patchwork.Lists,
		AxiosError,
		UpsertListMutationPayload
	>,
) => {
	return useMutation({ mutationFn: upsertListFn, ...options });
};

export const useListsDeleteMutation = (
	options: UseMutationOptions<
		{},
		AxiosError,
		{
			id: string;
		}
	>,
) => {
	return useMutation({ mutationFn: listsDeleteFn, ...options });
};

export const useAddAccountToListMutation = (
	options: UseMutationOptions<
		{},
		AxiosError,
		{
			id: string;
			accountId: string;
		}
	>,
) => {
	return useMutation({ mutationFn: addAccountToListFn, ...options });
};

export const useRemoveAccountFromListMutation = (
	options: UseMutationOptions<
		{},
		AxiosError,
		{
			id: string;
			accountId: string;
		}
	>,
) => {
	return useMutation({ mutationFn: removeAccountFromListFn, ...options });
};
