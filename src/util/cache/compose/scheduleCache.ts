import { queryClient } from '@/App';

export const removeScheduleFromScheduleList = (scheduleId: string) => {
	const queryKey = ['schedule-list'];
	const previousData = queryClient.getQueryData<Patchwork.Schedule[]>(queryKey);
	if (previousData) {
		const updatedData: Patchwork.Schedule[] = previousData.filter(
			item => item.id.toString() !== scheduleId,
		);
		queryClient.setQueryData(queryKey, updatedData);
	}
};
