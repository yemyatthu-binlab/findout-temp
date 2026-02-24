import { create } from 'zustand';

interface SensitiveMediaState {
	sensitiveMedia: Record<string, boolean>;
	toggleSensitiveMedia: (id: string) => void;
}

export const useSensitiveMediaStore = create<SensitiveMediaState>(set => ({
	sensitiveMedia: {},
	toggleSensitiveMedia: id =>
		set(state => ({
			sensitiveMedia: {
				...state.sensitiveMedia,
				[id]: !state.sensitiveMedia[id],
			},
		})),
}));
