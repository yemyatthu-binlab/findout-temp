import { create } from 'zustand';

interface LikeSheetState {
	isOpen: boolean;
	postId: number | null;
	openLikeSheet: (postId: number) => void;
	closeLikeSheet: () => void;
}

export const useLikeSheetStore = create<LikeSheetState>(set => ({
	isOpen: false,
	postId: null,
	openLikeSheet: (postId: number) => set({ isOpen: true, postId }),
	closeLikeSheet: () => set({ isOpen: false, postId: null }),
}));
