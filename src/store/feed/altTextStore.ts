import { create } from 'zustand';

interface AltTextStore {
	showAltText: boolean;
	altText: string;
	toggleAltText: () => void;
	setAltText: (text: string) => void;
}

export const useAltTextStore = create<AltTextStore>(set => ({
	showAltText: false,
	altText: '',
	toggleAltText: () => set(state => ({ showAltText: !state.showAltText })),
	setAltText: (text: string) => set({ altText: text }),
}));
