import { AxiosResponse } from 'axios';
import instance from './instance';
import { appendApiVersion, handleError } from '@/util/helper/helper';
import { QueryFunctionContext } from '@tanstack/react-query';
import { GetBookmarkListQueryKey } from '@/types/queries/statusActions';
import { useAuthStore } from '@/store/auth/authStore';
import { CHANNEL_INSTANCE, NEWSMAST_INSTANCE_V1 } from '@/util/constant';

export const statusDeleteFn = async ({
	status_id,
}: {
	status_id: Patchwork.Status['id'];
}) => {
	try {
		const resp: AxiosResponse<Patchwork.Status> = await instance.delete(
			appendApiVersion(`statuses/${status_id}`, 'v1'),
		);
		return resp.data;
	} catch (error) {
		return handleError(error);
	}
};

export const getEditStatusSourceFn = async ({
	status_id,
}: {
	status_id: Patchwork.Status['id'];
}) => {
	try {
		const resp: AxiosResponse<Patchwork.Status> = await instance.get(
			appendApiVersion(`statuses/${status_id}/source`, 'v1'),
		);
		return resp.data;
	} catch (error) {
		return handleError(error);
	}
};

export const bookmarkStatus = async ({
	status,
}: {
	status: Patchwork.Status;
}) => {
	try {
		const toggleBookmark = status.bookmarked ? 'unbookmark' : 'bookmark';
		const resp: AxiosResponse<Patchwork.Status> = await instance.post(
			appendApiVersion(`statuses/${status.id}/${toggleBookmark}`, 'v1'),
		);
		return resp.data;
	} catch (error) {
		return handleError(error);
	}
};

export const getBookmarkList = async (
	qfContext: QueryFunctionContext<GetBookmarkListQueryKey>,
) => {
	try {
		const { domain_name } = qfContext.queryKey[1];
		const max_id = qfContext.pageParam as string;
		const { userOriginInstance } = useAuthStore.getState();
		const isUserFormDifferentInstance =
			domain_name == CHANNEL_INSTANCE &&
			userOriginInstance !== CHANNEL_INSTANCE;

		const resp: AxiosResponse<
			Patchwork.Status[] | { data: Patchwork.Status[] }
		> = await instance.get(appendApiVersion(`bookmarks`), {
			params: {
				domain_name: isUserFormDifferentInstance
					? userOriginInstance
					: domain_name,
				isDynamicDomain: true,
				max_id,
			},
		});
		const linkHeader = resp.headers.link as string;
		let maxId = null;
		if (linkHeader) {
			const regex = /max_id=(\d+)/;
			const match = linkHeader.match(regex);
			if (match) {
				maxId = match[1];
			}
		}

		return {
			data:
				domain_name === NEWSMAST_INSTANCE_V1
					? (resp?.data as { data: Patchwork.Status[] })?.data
					: (resp?.data as Patchwork.Status[]),
			links: { next: { max_id: maxId } },
		};
	} catch (e) {
		return handleError(e);
	}
};

export const revokeQuote = async ({
	quotedStatusId,
	quotingStatusId,
}: {
	quotedStatusId: string;
	quotingStatusId: string;
}): Promise<Patchwork.Status> => {
	try {
		const resp: AxiosResponse<Patchwork.Status> = await instance.post(
			appendApiVersion(
				`statuses/${quotedStatusId}/quotes/${quotingStatusId}/revoke`,
				'v1',
			),
		);
		return resp.data;
	} catch (error) {
		return handleError(error);
	}
};
