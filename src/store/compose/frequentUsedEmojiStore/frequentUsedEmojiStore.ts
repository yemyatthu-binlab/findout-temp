import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type FrequentEmojiState = {
	emojiList: {
		custom: Patchwork.CustomEmojis[];
		standard: string[];
	};
	actions: {
		addEmoji: (
			input:
				| { type: 'custom'; emoji: Patchwork.CustomEmojis }
				| { type: 'standard'; emoji: string },
		) => void;
	};
};

export const useEmojiStore = create<FrequentEmojiState>()(
	persist(
		(set, get) => ({
			emojiList: { custom: [], standard: [] },
			actions: {
				addEmoji: input => {
					set(state => {
						const { type, emoji } = input;
						const list = state.emojiList[type];
						const filtered = list.filter(e =>
							type === 'custom'
								? (e as Patchwork.CustomEmojis).shortcode !==
								  (emoji as Patchwork.CustomEmojis).shortcode
								: e !== emoji,
						);
						const updated = [emoji, ...filtered].slice(0, 32);
						return {
							emojiList: {
								...state.emojiList,
								[type]: updated,
							},
						};
					});
				},
			},
		}),
		{
			name: 'emoji-store-persit',
			storage: createJSONStorage(() => AsyncStorage),
			partialize: state => ({
				emojiList: state.emojiList,
			}),
		},
	),
);
