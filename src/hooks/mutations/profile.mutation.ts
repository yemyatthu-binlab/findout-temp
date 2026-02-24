import {
	changeUserLocale,
	changeUserSetting,
	changeUserThemeSetting,
	deleteProfileMedia,
	followRequestsQueryFn,
	relationshipQueryFn,
	updateAccNoti,
	updateProfile,
} from '@/services/profile.service';
import { UpdateProfilePayload } from '@/types/queries/profile.type';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

export const useProfileMutation = (
	options: UseMutationOptions<
		Patchwork.Account,
		AxiosError,
		UpdateProfilePayload
	>,
) => {
	return useMutation({ mutationFn: updateProfile, ...options });
};

export const useUserRelationshipMutation = (
	options: UseMutationOptions<
		Patchwork.RelationShip,
		AxiosError,
		{ accountId: string; isFollowing: boolean }
	>,
) => {
	return useMutation({ mutationFn: relationshipQueryFn, ...options });
};

export const useFollowRequestsMutation = (
	options: UseMutationOptions<
		Patchwork.RelationShip,
		AxiosError,
		{ accountId: string; requestType: 'authorize' | 'reject' }
	>,
) => {
	return useMutation({ mutationFn: followRequestsQueryFn, ...options });
};

export const useDeleteProfileMediaMutation = (
	options: UseMutationOptions<
		Patchwork.Account,
		AxiosError,
		{ mediaType: 'avatar' | 'header' }
	>,
) => {
	return useMutation({
		mutationFn: deleteProfileMedia,
		...options,
	});
};

export const useChangeUserTheme = (
	options: UseMutationOptions<
		{ message: string },
		AxiosError,
		{ theme: 'light' | 'dark' | undefined }
	>,
) => {
	return useMutation({
		mutationFn: changeUserThemeSetting,
		...options,
	});
};

export const useChangeUserLocale = (
	options: UseMutationOptions<
		{ message: string },
		AxiosError,
		{ lang: string }
	>,
) => {
	return useMutation({
		mutationFn: changeUserLocale,
		...options,
	});
};

export const useChangeUserSetting = (
	options: UseMutationOptions<
		{ message: string },
		AxiosError,
		{ user_timeline: number[] }
	>,
) => {
	return useMutation({
		mutationFn: changeUserSetting,
		...options,
	});
};

export const useUpdateAccNoti = (
	options: UseMutationOptions<
		Patchwork.RelationShip,
		AxiosError,
		{ accountId: string; notify: boolean }
	>,
) => {
	return useMutation({ mutationFn: updateAccNoti, ...options });
};
