import {
	accountInfoQueryFn,
	checkRelationshipQueryFn,
	checkUserThemeSetting,
	getFollowerAccountsQueryFn,
	getFollowingAccountsQueryFn,
	getSpecificServerProfile,
	getSuggestedPeople,
	getUserLocale,
	getUserSetting,
} from '@/services/profile.service';
import {
	UserLocaleQueryKey,
	UserSetting,
	UserThemeSettingQueryKey,
} from '@/types/queries/feed.type';
import {
	AccountInfoQueryKey,
	CheckRelationshipQueryKey,
	FollowerAccountsQueryKey,
	FollowingAccountsQueryKey,
	GetSuggestedPeopleQueryKey,
	SpecificServerProfileQueryKey,
} from '@/types/queries/profile.type';
import { QueryOptionHelper } from '@/util/helper/helper';
import { infinitePageParam, PagedResponse } from '@/util/helper/timeline';
import {
	InfiniteData,
	useInfiniteQuery,
	useQuery,
} from '@tanstack/react-query';
import { useMemo } from 'react';

export const useAccountInfo = (
	queryKey: AccountInfoQueryKey,
	option?: { enabled: boolean },
) => {
	return useQuery({
		queryKey,
		queryFn: accountInfoQueryFn,
		enabled: option?.enabled,
	});
};

export const createRelationshipQueryKey = (accountIds: string[]) =>
	['check-relationship-to-other-accounts', { accountIds }] as const;

export const useCheckRelationships = ({
	options,
	...queryParam
}: CheckRelationshipQueryKey[1] & {
	options?: QueryOptionHelper<Patchwork.RelationShip[] | undefined>;
}) => {
	const queryKey: CheckRelationshipQueryKey = [
		'check-relationship-to-other-accounts',
		queryParam,
	];
	return useQuery({
		queryKey,
		//@ts-expect-error
		queryFn: checkRelationshipQueryFn,
		...options,
	});
};

export const useSpecificServerProfile = ({
	options,
	...queryParam
}: SpecificServerProfileQueryKey[1] & {
	options?: QueryOptionHelper<Patchwork.SearchResult | undefined>;
}) => {
	const queryKey: SpecificServerProfileQueryKey = [
		'specify-server-profile',
		queryParam,
	];
	return useQuery({
		queryKey,
		//@ts-expect-error
		queryFn: getSpecificServerProfile,
		...options,
	});
};

export const useFollowingAccountsQuery = ({
	options,
	...queryParam
}: FollowingAccountsQueryKey[1] & {
	options?: { enabled: boolean };
}) => {
	const queryKey: FollowingAccountsQueryKey = [
		'following-accounts',
		queryParam,
	];
	return useInfiniteQuery<
		PagedResponse<Patchwork.Account[]>,
		Error,
		InfiniteData<PagedResponse<Patchwork.Account[]>>
	>({
		queryKey,
		...options,
		//@ts-expect-error
		queryFn: getFollowingAccountsQueryFn,
		retry: false,
		...infinitePageParam,
	});
};

export const useFollowerAccountsQuery = (
	queryParam: FollowerAccountsQueryKey[1],
) => {
	const queryKey: FollowerAccountsQueryKey = ['follower-accounts', queryParam];
	return useInfiniteQuery<
		PagedResponse<Patchwork.Account[]>,
		Error,
		InfiniteData<PagedResponse<Patchwork.Account[]>>
	>({
		queryKey,
		//@ts-expect-error
		queryFn: getFollowerAccountsQueryFn,
		...infinitePageParam,
	});
};

// export const useGetProfileDetailStatus = ({ id }: ProfileDetailQueryKey[1]) => {
// 	const queryKey: ProfileDetailStatusQueryKey = [
// 		'get_profile_detail_statuses_by_account',
// 		{ id },
// 	];
// 	return useQuery({
// 		queryKey,
// 		queryFn: getProfileDetailStatus,
// 	});
// };

export const useGetSuggestedPeople = ({
	options,
	...queryParam
}: GetSuggestedPeopleQueryKey[1] & {
	options?: QueryOptionHelper<Patchwork.SuggestedPeople[] | undefined>;
}) => {
	const queryKey: GetSuggestedPeopleQueryKey = ['suggested-people', queryParam];

	return useQuery({
		queryKey,
		//@ts-expect-error
		queryFn: getSuggestedPeople,
		...options,
	});
};

export const useUserThemeSetting = (enabled?: boolean) => {
	const queryKey: UserThemeSettingQueryKey = ['user-theme-setting'];
	return useQuery({
		queryKey,
		queryFn: checkUserThemeSetting,
		enabled,
		gcTime: Infinity,
	});
};

export const useGetUserLocale = () => {
	const queryKey: UserLocaleQueryKey = ['user-locale'];
	return useQuery({
		queryKey,
		queryFn: getUserLocale,
	});
};

export const useUserSetting = (enabled?: boolean) => {
	const queryKey: UserSetting = ['user-setting'];
	return useQuery({
		queryKey,
		queryFn: getUserSetting,
		enabled,
		gcTime: Infinity,
	});
};
