import { create } from 'zustand';

interface EditPhotoMetaState {
	editPhotoModal: boolean;
	selectedPhoto: Patchwork.Attachment | null;
	actions: {
		openEditPhotoModal: () => void;
		closeEditPhotoModal: () => void;
		onSelectedPhoto: (media: Patchwork.Attachment) => void;
		resetEditPhotoMeta: () => void;
	};
}

export const useEditPhotoMeta = create<EditPhotoMetaState>()(set => ({
	editPhotoModal: false,
	selectedPhoto: null,
	actions: {
		openEditPhotoModal: () => set({ editPhotoModal: true }),
		closeEditPhotoModal: () => set({ editPhotoModal: false }),
		onSelectedPhoto: photo => set(() => ({ selectedPhoto: photo })),
		resetEditPhotoMeta: () =>
			set(() => ({ editPhotoModal: false, selectedPhoto: null })),
	},
}));

export const useEditPhotoMetaActions = () =>
	useEditPhotoMeta(state => state.actions);
