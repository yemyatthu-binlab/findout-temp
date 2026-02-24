import { queryClient } from '@/App';
import {
	GetFavouriteChannelListsQueryKey,
	GetNewsmastChannelListWBearerTokenQueryKey,
} from '@/types/queries/channel.type';
import {
	AltTextSetting,
	CheckEmailNotiSettingQueryKey,
} from '@/types/queries/feed.type';

export const updateContributorListInSearchModal = (
	keyword: string,
	accountId: string,
	followingStatus: Patchwork.ContributorFollowStatus,
	operationType: 'follow' | 'mute',
) => {
	const queryKey = ['search-contributor', { keyword }];
	const previousData =
		queryClient.getQueryData<Patchwork.SearchContributorRes>(queryKey);
	if (previousData) {
		const updatedData: Patchwork.SearchContributorRes = {
			...previousData,
			accounts: previousData.accounts.map(account => {
				if (operationType == 'follow') {
					return account.id === accountId
						? { ...account, following: followingStatus }
						: account;
				}
				return account.id === accountId
					? { ...account, is_muted: !account.is_muted }
					: account;
			}),
		};
		queryClient.setQueryData(queryKey, updatedData);
	}
};

export const updateContributorListInForm = (
	channelId: string,
	contributorId: string,
) => {
	const queryKey = ['contributor-list', { channelId }];
	const previousData =
		queryClient.getQueryData<Patchwork.ContributorList[]>(queryKey);
	if (previousData) {
		const updatedData: Patchwork.ContributorList[] = previousData.filter(
			item => item.id !== contributorId,
		);
		queryClient.setQueryData(queryKey, updatedData);
	}
};

export const updateChannelContentTypeCache = (
	channelId: string,
	custom_condition: 'and_condition' | 'or_condition',
) => {
	const queryKey = ['channel-content-type', { channelId }];
	const previousData =
		queryClient.getQueryData<Patchwork.ChannelContentTpye[]>(queryKey);
	if (previousData) {
		const updatedData: Patchwork.ChannelContentTpye[] = previousData.map(
			item => {
				return {
					...item,
					attributes: {
						...item.attributes,
						custom_condition,
					},
				};
			},
		);
		queryClient.setQueryData(queryKey, updatedData);
	}
};

export const updateMutedContributorListInForm = (
	channelId: string,
	contributorId: string,
) => {
	const queryKey = ['muted-contributor-list', { channelId }];
	const previousData =
		queryClient.getQueryData<Patchwork.ContributorList[]>(queryKey);
	if (previousData) {
		const updatedData: Patchwork.ContributorList[] = previousData.filter(
			item => item.id !== contributorId,
		);
		queryClient.setQueryData(queryKey, updatedData);
	}
};

export const updateNotiMuteUnMuteCache = (updatedStatus: boolean) => {
	const queryKey = ['notification-mute-unmute'];
	const previousData = queryClient.getQueryData<{ mute: boolean }>(queryKey);
	if (previousData) {
		queryClient.setQueryData(queryKey, { mute: updatedStatus });
	}
};

export const updateEmailNotiSetting = (allowed: boolean) => {
	const queryKey: CheckEmailNotiSettingQueryKey = ['check-email-noti-setting'];
	const previousData = queryClient.getQueryData<{ mute: boolean }>(queryKey);
	if (previousData) {
		queryClient.setQueryData(queryKey, { data: allowed });
	}
};

export const updateCacheOnFavouriteChannel = (variables: { id: string }) => {
	const favChannelListQueryKey: GetFavouriteChannelListsQueryKey = [
		'favourite-channel-lists',
	];
	const queryKey: GetNewsmastChannelListWBearerTokenQueryKey = [
		'newsmast-channel-list-bearer',
	];

	queryClient.setQueryData<Patchwork.ChannelList[]>(queryKey, oldList => {
		if (!oldList) return;
		return oldList.map(item =>
			item.attributes.slug === variables.id
				? {
						...item,
						attributes: {
							...item.attributes,
							favourited: !item.attributes.favourited,
							favourited_count: !item.attributes.favourited
								? (item.attributes.favourited_count || 0) + 1
								: Math.max((item.attributes.favourited_count || 1) - 1, 0),
						},
				  }
				: item,
		);
	});

	const allNewsmastChannel =
		queryClient.getQueryData<Patchwork.ChannelList[]>(queryKey);

	queryClient.setQueryData<Patchwork.ChannelList[]>(
		favChannelListQueryKey,
		oldList => {
			if (!oldList) {
				return oldList;
			}
			const exists = oldList.find(c => c.id === variables.id);
			if (exists) return oldList;

			const channel = allNewsmastChannel?.find(
				chn => chn.attributes?.slug === variables.id,
			);
			if (channel) {
				return [channel, ...oldList];
			}
			return oldList;
		},
	);
};

export const updateCacheOnUnfavouriteChannel = (variables: { id: string }) => {
	const favChannelListQueryKey: GetFavouriteChannelListsQueryKey = [
		'favourite-channel-lists',
	];
	const queryKey: GetNewsmastChannelListWBearerTokenQueryKey = [
		'newsmast-channel-list-bearer',
	];

	queryClient.setQueryData<Patchwork.ChannelList[]>(queryKey, oldList => {
		if (!oldList) return;
		return oldList.map(item =>
			item.attributes.slug === variables.id
				? {
						...item,
						attributes: {
							...item.attributes,
							favourited: !item.attributes.favourited,
							favourited_count: !item.attributes.favourited
								? (item.attributes.favourited_count || 0) + 1
								: Math.max((item.attributes.favourited_count || 1) - 1, 0),
						},
				  }
				: item,
		);
	});

	queryClient.setQueryData<Patchwork.ChannelList[]>(
		favChannelListQueryKey,
		oldList => {
			if (!oldList) return [];
			return oldList.filter(chn => chn.attributes?.slug !== variables.id);
		},
	);
};

export const updateCacheOnSettingPrimary = (variables: { id: string }) => {
	const favChannelListQueryKey: GetFavouriteChannelListsQueryKey = [
		'favourite-channel-lists',
	];
	const queryKey: GetNewsmastChannelListWBearerTokenQueryKey = [
		'newsmast-channel-list-bearer',
	];
	queryClient.setQueryData<Patchwork.ChannelList[]>(queryKey, oldList => {
		if (!oldList) return;
		return oldList.map(item => {
			if (item.attributes.slug === variables.id) {
				return {
					...item,
					attributes: {
						...item.attributes,
						is_primary: !item.attributes.is_primary,
					},
				};
			}
			return {
				...item,
				attributes: {
					...item.attributes,
					is_primary: false,
				},
			};
		});
	});

	queryClient.setQueryData<Patchwork.ChannelList[]>(
		favChannelListQueryKey,
		oldList => {
			if (!oldList) return oldList;
			const nonPrimaryChannels: Patchwork.ChannelList[] = [];
			let primary: Patchwork.ChannelList | undefined;

			oldList.forEach(channel => {
				const isPrimary = channel.attributes.slug === variables.id;
				const updatedChannel = {
					...channel,
					attributes: {
						...channel.attributes,
						is_primary: isPrimary,
					},
				};
				if (isPrimary) {
					primary = updatedChannel;
				} else {
					nonPrimaryChannels.push(updatedChannel);
				}
			});

			return primary ? [primary, ...nonPrimaryChannels] : nonPrimaryChannels;
		},
	);
};

export const updateAltTextSettingCache = (enabled: boolean) => {
	const queryKey: AltTextSetting = ['alt-text-setting'];
	const previousData = queryClient.getQueryData<{ mute: boolean }>(queryKey);
	if (previousData) {
		queryClient.setQueryData(queryKey, { data: enabled });
	}
};
