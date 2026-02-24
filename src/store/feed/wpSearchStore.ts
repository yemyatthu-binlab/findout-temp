import { create } from 'zustand';

interface WpSearchState {
	searchQuery: string;
	debouncedSearchQuery: string;
	setSearchQuery: (query: string) => void;
	setDebouncedSearchQuery: (query: string) => void;
	clearSearch: () => void;
}

export const useWpSearchStore = create<WpSearchState>(set => ({
	searchQuery: '',
	debouncedSearchQuery: '',
	setSearchQuery: query => set({ searchQuery: query }),
	setDebouncedSearchQuery: query => set({ debouncedSearchQuery: query }),
	clearSearch: () => set({ searchQuery: '', debouncedSearchQuery: '' }),
}));
