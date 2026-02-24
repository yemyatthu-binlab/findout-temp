import { create } from 'zustand';

interface CommentUIState {
	isOpen: boolean;
	postId: number | null;
	openComments: (postId: number) => void;
	closeComments: () => void;
}

export const useCommentUIStore = create<CommentUIState>(set => ({
	isOpen: false,
	postId: null,
	openComments: postId => set({ isOpen: true, postId }),
	closeComments: () => set({ isOpen: false, postId: null }),
}));
