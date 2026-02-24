import { create } from 'zustand';

interface WpStoryState {
	selectedPost: Patchwork.WPStory | null;
	setSelectedPost: (post: Patchwork.WPStory) => void;
}

export const useWpStoryStore = create<WpStoryState>(set => ({
	selectedPost: null,
	setSelectedPost: post => set({ selectedPost: post }),
}));
