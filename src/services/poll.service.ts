import { appendApiVersion, handleError } from '@/util/helper/helper';
import { AxiosResponse } from 'axios';
import instance from './instance';
import { GetSpecificPollInfo } from '@/types/queries/statusActions';

export const vote = async ({
	id,
	choices,
}: {
	id: string;
	choices: number[];
}) => {
	try {
		const resp: AxiosResponse<Patchwork.Status['poll']> = await instance.post(
			appendApiVersion(`polls/${id}/votes`, 'v1'),
			{ choices },
		);
		return resp.data;
	} catch (error) {
		return handleError(error);
	}
};

export const getSpecificPollInfo = async ({
	queryKey,
}: {
	queryKey: GetSpecificPollInfo;
}) => {
	const [, params] = queryKey;
	try {
		const resp: AxiosResponse<Patchwork.Status['poll']> = await instance.get(
			appendApiVersion(`polls/${params.id}`, 'v1'),
		);
		return resp.data;
	} catch (error) {
		return handleError(error);
	}
};
