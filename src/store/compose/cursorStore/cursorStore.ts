import { create } from 'zustand';

interface CursorState {
	selectionStart: number;
	setSelectionStart: (position: number) => void;
}

export const useCursorStore = create<CursorState>(set => ({
	selectionStart: 0,
	setSelectionStart: position => set({ selectionStart: position }),
}));
