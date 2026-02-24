import { create } from 'zustand';

interface ContentUIState {
	isOpen: boolean;
	post: Patchwork.WPStory | null;
	openContent: (post: Patchwork.WPStory) => void;
	closeContent: () => void;
}

export const useContentUIStore = create<ContentUIState>(set => ({
	isOpen: false,
	post: null,
	openContent: post => set({ isOpen: true, post }),
	closeContent: () => set({ isOpen: false, post: null }),
}));
