import { create } from 'zustand';

interface TranslationLanguageStore {
	translationLanguageData: Record<string, string[]>;
	setTranslationLanguageData: (data: Record<string, string[]>) => void;
}

export const useTranslationLanguageStore = create<TranslationLanguageStore>(
	set => ({
		translationLanguageData: {},
		setTranslationLanguageData: data => set({ translationLanguageData: data }),
	}),
);
