export type ListsQueryKey = ['lists'];
export type ListTimelinesQueryKey = ['list-timelines', { id: string }];
export type ListDetailQueryKey = ['list-detail', { id: string | undefined }];
export type ListMembersQueryKey = ['list-members', { id: string | undefined }];

export type UpsertListMutationPayload = {
	id?: string; // To Edit Lists
	title: string;
	replies_policy: 'followed' | 'list' | 'none';
	exclusive: boolean;
};
