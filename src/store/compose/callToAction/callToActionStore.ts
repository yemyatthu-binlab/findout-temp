import { Asset } from 'react-native-image-picker';
import { create } from 'zustand';

type CallToActionState = {
	ctaModalVisible: boolean;
	ctaText: string;
	actions: {
		onToggleCTAModal: () => void;
		onChangeCTAText: (text: string) => void;
	};
};

export const useCallToActionStore = create<CallToActionState>()(set => ({
	ctaModalVisible: false,
	ctaText: '',
	actions: {
		onToggleCTAModal: () =>
			set(state => ({ ctaModalVisible: !state.ctaModalVisible })),
		onChangeCTAText: (text: string) => set({ ctaText: text }),
	},
}));

export const useCTAactions = () => useCallToActionStore(state => state.actions);
