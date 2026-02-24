import { create } from 'zustand';

interface UiState {
	isNavBarVisible: boolean;
	setIsNavBarVisible: (isVisible: boolean) => void;
}

export const useWpReadUiStore = create<UiState>(set => ({
	isNavBarVisible: true,
	setIsNavBarVisible: isVisible => set({ isNavBarVisible: isVisible }),
}));
