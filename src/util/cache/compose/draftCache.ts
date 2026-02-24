import { queryClient } from '@/App';
import { ViewMultiDraftQueryKey } from '@/types/queries/feed.type';

export const removeDraftPostFromDraftList = (id: string) => {
	const queryKey: ViewMultiDraftQueryKey = ['view-multi-draft'];
	const previousData =
		queryClient.getQueryData<Patchwork.MultiDraftStatusData[]>(queryKey);

	if (previousData) {
		const updatedData = previousData
			.map(item => ({
				...item,
				datas: item.datas.filter(draft => draft.id !== id),
			}))
			.filter(item => item.datas.length > 0);

		queryClient.setQueryData(queryKey, updatedData);
	}
};
