import { create } from 'zustand';

type LanguageSelectionState = {
	languageSelectionModalVisible: boolean;
	selectedLanguage: string;
	actions: {
		onToggleLanguageSelectionModal: () => void;
		setSelectedLanguage: (language: string) => void;
	};
};

export const useLanguageSelectionStore = create<LanguageSelectionState>()(
	set => ({
		languageSelectionModalVisible: false,
		selectedLanguage: 'en',
		actions: {
			onToggleLanguageSelectionModal: () =>
				set(state => ({
					languageSelectionModalVisible: !state.languageSelectionModalVisible,
				})),
			setSelectedLanguage: selectedLanguage => set({ selectedLanguage }),
		},
	}),
);

export const useLanguageSelectionActions = () =>
	useLanguageSelectionStore(state => state.actions);
