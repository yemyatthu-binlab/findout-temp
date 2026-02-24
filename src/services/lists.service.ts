import { AxiosResponse } from 'axios';
import instance from './instance';
import { appendApiVersion, handleError } from '@/util/helper/helper';
import { QueryFunctionContext } from '@tanstack/react-query';
import {
	UpsertListMutationPayload,
	ListTimelinesQueryKey,
	ListDetailQueryKey,
	ListMembersQueryKey,
} from '@/types/queries/lists.type';

export const listsFn = async () => {
	try {
		const resp: AxiosResponse<Patchwork.Lists[]> = await instance.get(
			appendApiVersion('lists'),
		);
		return resp.data;
	} catch (error) {
		return handleError(error);
	}
};

export const listTimelinesFn = async (
	qfContext: QueryFunctionContext<ListTimelinesQueryKey>,
) => {
	try {
		const { id } = qfContext.queryKey[1];
		const max_id = qfContext.pageParam as string;

		const resp: AxiosResponse<Patchwork.Status[]> = await instance.get(
			appendApiVersion(`timelines/list/${id}`),
			{
				params: {
					max_id,
				},
			},
		);
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
			data: resp.data,
			links: { next: { max_id: maxId } },
		};
	} catch (e) {
		return handleError(e);
	}
};

export const listDetailFn = async (
	qfContext: QueryFunctionContext<ListDetailQueryKey>,
) => {
	try {
		const { id } = qfContext.queryKey[1];
		const resp: AxiosResponse<Patchwork.Lists> = await instance.get(
			appendApiVersion(`lists/${id}`),
		);
		return resp.data;
	} catch (error) {
		return handleError(error);
	}
};

export const listMembersFn = async (
	qfContext: QueryFunctionContext<ListMembersQueryKey>,
) => {
	try {
		const { id } = qfContext.queryKey[1];
		const resp: AxiosResponse<Patchwork.Account[]> = await instance.get(
			appendApiVersion(`lists/${id}/accounts?limit=0`),
		);
		return resp.data;
	} catch (error) {
		return handleError(error);
	}
};

export const upsertListFn = async (params: UpsertListMutationPayload) => {
	try {
		const method = params.id ? 'put' : 'post';
		const url = appendApiVersion(
			params.id ? `lists/${params.id}` : 'lists',
			'v1',
		);
		const { data }: AxiosResponse<Patchwork.Lists> = await instance[method](
			url,
			params,
		);
		return data;
	} catch (error) {
		return handleError(error);
	}
};

export const listsDeleteFn = async ({ id }: { id: string }) => {
	try {
		const resp: {} = await instance.delete(
			appendApiVersion(`lists/${id}`, 'v1'),
		);
		return resp;
	} catch (error) {
		return handleError(error);
	}
};

export const addAccountToListFn = async ({
	id,
	accountId,
}: {
	id: string;
	accountId: string;
}) => {
	try {
		const resp: {} = await instance.post(
			appendApiVersion(`lists/${id}/accounts`, 'v1'),
			{ account_ids: [accountId] },
		);
		return resp;
	} catch (error) {
		return handleError(error);
	}
};

export const removeAccountFromListFn = async ({
	id,
	accountId,
}: {
	id: string;
	accountId: string;
}) => {
	try {
		const resp: {} = await instance.delete(
			appendApiVersion(`lists/${id}/accounts`, 'v1'),
			{
				data: { account_ids: [accountId] },
			},
		);
		return resp;
	} catch (error) {
		return handleError(error);
	}
};
