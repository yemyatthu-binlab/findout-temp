import { getSpecificPollInfo } from '@/services/poll.service';
import { GetSpecificPollInfo } from '@/types/queries/statusActions';
import { QueryOptionHelper } from '@/util/helper/helper';
import { useQuery } from '@tanstack/react-query';

export const useGetSpecificPollInfo = ({
	options,
	...queryParam
}: { id: string } & {
	options?: QueryOptionHelper<Patchwork.Poll | undefined>;
}) => {
	const queryKey: GetSpecificPollInfo = ['get-specific-poll-info', queryParam];
	return useQuery({
		queryKey,
		//@ts-expect-error
		queryFn: getSpecificPollInfo,
		...options,
	});
};
