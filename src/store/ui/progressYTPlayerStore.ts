import { create } from 'zustand';

interface YTVideoPlayerState {
	progressMap: Record<number, number>;
	setVideoProgress: (postId: number, time: number) => void;
}

export const useVideoPlayerStore = create<YTVideoPlayerState>(set => ({
	progressMap: {},
	setVideoProgress: (postId, time) =>
		set(state => ({
			progressMap: { ...state.progressMap, [postId]: time },
		})),
}));
