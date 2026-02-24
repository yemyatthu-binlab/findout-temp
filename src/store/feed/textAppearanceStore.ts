import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type FontScale = 'small' | 'medium' | 'large';

interface AppearanceState {
	fontScale: FontScale;
	setFontScale: (scale: FontScale) => void;
}

export const useAppearanceStore = create<AppearanceState>()(
	persist(
		set => ({
			fontScale: 'medium',
			setFontScale: scale => set({ fontScale: scale }),
		}),
		{
			name: 'appearance-settings-storage',
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
