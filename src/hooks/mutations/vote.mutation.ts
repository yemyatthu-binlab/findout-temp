import { vote } from '@/services/poll.service';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useVoteMutation = (
	options: UseMutationOptions<
		Patchwork.Status['poll'],
		AxiosError,
		{ id: string; choices: number[] }
	>,
) => {
	return useMutation({
		mutationFn: vote,
		...options,
	});
};
