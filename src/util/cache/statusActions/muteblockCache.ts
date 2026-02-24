import { queryClient } from '@/App';
import { PagedResponse } from '@/util/helper/timeline';
import { InfiniteData } from '@tanstack/react-query';

export const updateMuteState = (response: Patchwork.RelationShip) => {
	queryClient.setQueryData<
		InfiniteData<PagedResponse<Patchwork.MuteBlockUserAccount[]>>
	>(['muted-user-list'], oldData => {
		if (!oldData) return;
		return {
			...oldData,
			pages: oldData.pages.map(page => ({
				...page,
				data: page.data.map(user => {
					if (user.id === response.id) {
						return { ...user, isUnMutedNow: !response.muting };
					}
					return user;
				}),
			})),
		};
	});
};

export const updateBlockState = (response: Patchwork.RelationShip) => {
	queryClient.setQueryData<
		InfiniteData<PagedResponse<Patchwork.MuteBlockUserAccount[]>>
	>(['blocked-user-list'], oldData => {
		if (!oldData) return;
		return {
			...oldData,
			pages: oldData.pages.map(page => ({
				...page,
				data: page.data.map(user => {
					if (user.id === response.id) {
						return { ...user, isUnBlockedNow: !response.blocking };
					}
					return user;
				}),
			})),
		};
	});
};
