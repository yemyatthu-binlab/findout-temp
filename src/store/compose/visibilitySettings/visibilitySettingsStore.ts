import { create } from 'zustand';

type VisibilitySettingsState = {
	visibilityModalVisible: boolean;
	visibility: string;
	actions: {
		onToggleVisibilityModal: () => void;
		setVisibility: (i: string) => void;
		resetVisibility: () => void;
	};
};

export const useVisibilitySettingsStore = create<VisibilitySettingsState>()(
	set => ({
		visibilityModalVisible: false,
		visibility: 'public',
		actions: {
			onToggleVisibilityModal: () =>
				set(state => ({
					visibilityModalVisible: !state.visibilityModalVisible,
				})),
			setVisibility: visibility => set({ visibility }),
			resetVisibility: () => set({ visibility: 'public' }),
		},
	}),
);

export const useVisibilitySettingsActions = () =>
	useVisibilitySettingsStore(state => state.actions);
