import { queryClient } from '@/App';
import { getStatusDetail } from '@/services/feed.service';
import { useQuery } from '@tanstack/react-query';

export const useStatus = (
	statusId: string,
	domain_name: string,
	statusFromListQuery: Patchwork.Status,
) => {
	return useQuery({
		queryKey: ['status', { id: statusId }],
		queryFn: getStatusDetail,
		initialData: () => {
			const statusFromQueryCache = queryClient.getQueryData([
				'status',
				{ id: statusId },
			]);

			return statusFromQueryCache
				? queryClient.getQueryData(['status', { id: statusId }])
				: statusFromListQuery;
		},
		staleTime: Infinity,
		gcTime: 1000 * 60,
		meta: { domain_name },
	});
};
