import { queryClient } from '@/App';
import { StatusCacheQueryKeys } from '../queryCacheHelper';

type UpdateStatusCacheParams = {
	status_id: Patchwork.Status['id'];
	updatedStatus: Partial<Patchwork.Status>;
	queryKeys: StatusCacheQueryKeys[];
};

const updateEditedStatusInFeed = (
	data: IFeedQueryFnData,
	status_id: string,
	updatedStatus: Partial<Patchwork.Status>,
): IFeedQueryFnData => ({
	...data,
	pages: data.pages.map(page => ({
		...page,
		data: page.data.map(status => {
			if (status.id === status_id) {
				return { ...status, ...updatedStatus };
			}
			return status;
		}),
	})),
});

const updateEditedStatusInQueryCache = (
	queryKey: StatusCacheQueryKeys,
	status_id: string,
	updatedStatus: Partial<Patchwork.Status>,
) => {
	const previousData = queryClient.getQueryData<IFeedQueryFnData>(queryKey);
	if (!previousData) return;

	const updatedData = updateEditedStatusInFeed(
		previousData,
		status_id,
		updatedStatus,
	);

	queryClient.setQueryData(queryKey, updatedData);
};

const editedStatusCacheData = ({
	status_id,
	updatedStatus,
	queryKeys,
}: UpdateStatusCacheParams): void => {
	queryKeys.forEach(queryKey => {
		updateEditedStatusInQueryCache(queryKey, status_id, updatedStatus);
	});
};

export { editedStatusCacheData };
