import { create } from 'zustand';

interface QuoteStore {
	quotedStatus: Patchwork.Status | null;
	setQuotedStatus: (status: Patchwork.Status) => void;
	clearQuotedStatus: () => void;
}

export const useQuoteStore = create<QuoteStore>(set => ({
	quotedStatus: null,
	setQuotedStatus: (status: Patchwork.Status) => set({ quotedStatus: status }),
	clearQuotedStatus: () => set({ quotedStatus: null }),
}));
