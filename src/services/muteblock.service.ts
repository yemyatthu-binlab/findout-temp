import { MutedUserListQueryKey } from '@/types/queries/muteblock.type';
import { QueryFunctionContext } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import instance from './instance';
import { appendApiVersion, handleError } from '@/util/helper/helper';
import { max } from 'lodash';

export const getMutedUserList = async (
	qfContext: QueryFunctionContext<MutedUserListQueryKey>,
) => {
	try {
		const max_id = qfContext.pageParam as string;

		const resp: AxiosResponse<Patchwork.MuteBlockUserAccount[]> =
			await instance.get(appendApiVersion(`mutes`), {
				params: {
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
			data: resp.data,
			links: { next: { max_id: maxId } },
		};
	} catch (e) {
		return handleError(e);
	}
};

export const getBlockedUserList = async (
	qfContext: QueryFunctionContext<MutedUserListQueryKey>,
) => {
	try {
		const max_id = qfContext.pageParam as string;

		const resp: AxiosResponse<Patchwork.MuteBlockUserAccount[]> =
			await instance.get(appendApiVersion(`blocks`), {
				params: {
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
			data: resp.data,
			links: { next: { max_id: maxId } },
		};
	} catch (e) {
		return handleError(e);
	}
};
