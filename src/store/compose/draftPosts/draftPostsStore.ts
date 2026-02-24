import { create } from 'zustand';

type DraftType = 'create' | 'update';

type State = {
	isVisibleDraftPostsModal: boolean;
	draftType: DraftType;
	selectedDraftId: string | null;
	actions: {
		onToggleDraftPostsModal: () => void;
		setDraftType: (type: DraftType) => void;
		setSelectedDraftId: (id: string | null) => void;
	};
};

export const useDraftPostsStore = create<State>(set => ({
	isVisibleDraftPostsModal: false,
	draftType: 'create',
	selectedDraftId: null,
	actions: {
		onToggleDraftPostsModal: () =>
			set(state => ({
				isVisibleDraftPostsModal: !state.isVisibleDraftPostsModal,
			})),
		setDraftType: (type: DraftType) => set({ draftType: type }),
		setSelectedDraftId: (id: string | null) => set({ selectedDraftId: id }),
	},
}));

export const useDraftPostsActions = () =>
	useDraftPostsStore(state => state.actions);
