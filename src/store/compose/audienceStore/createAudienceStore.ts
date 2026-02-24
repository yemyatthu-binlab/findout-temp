import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AudienceStore = {
	selectedAudience: Patchwork.ChannelAttributes[];
	setSelectedAudience: (audience: Patchwork.ChannelAttributes[]) => void;
	toggleAudience: (audience: Patchwork.ChannelAttributes) => void;
	removeHashtagFromAudience: (audienceId: string, hashtag: string) => void;
	clearAudience: () => void;
};

export const useCreateAudienceStore = create<AudienceStore>()(
	persist(
		(set, get) => ({
			selectedAudience: [],
			setSelectedAudience: audience => set({ selectedAudience: audience }),
			toggleAudience: audience =>
				set(state => {
					const exists = state.selectedAudience.find(a => a.id === audience.id);
					return {
						selectedAudience: exists
							? state.selectedAudience.filter(a => a.id !== audience.id)
							: [...state.selectedAudience, audience],
					};
				}),
			removeHashtagFromAudience: (audienceId: string, hashtag: string) =>
				set(state => {
					const updatedAudience = state.selectedAudience
						.map(aud => {
							if (aud.id?.toString() === audienceId) {
								const updatedHashtags =
									aud?.patchwork_community_hashtags?.filter(
										h => h.hashtag !== hashtag,
									);
								if (updatedHashtags && updatedHashtags.length > 0) {
									return {
										...aud,
										patchwork_community_hashtags: updatedHashtags,
									};
								}
								return null;
							}
							return aud;
						})
						.filter((aud): aud is Patchwork.ChannelAttributes => aud !== null);
					return {
						selectedAudience: updatedAudience,
					};
				}),

			clearAudience: () => set({ selectedAudience: [] }),
		}),
		{
			name: 'audience-store',
			storage: {
				getItem: async key => {
					const value = await AsyncStorage.getItem(key);
					return value ? JSON.parse(value) : null;
				},
				setItem: async (key, value) => {
					await AsyncStorage.setItem(key, JSON.stringify(value));
				},
				removeItem: async key => {
					await AsyncStorage.removeItem(key);
				},
			},
			partialize: state =>
				({
					selectedAudience: state.selectedAudience,
				} as unknown as AudienceStore),
		},
	),
);
