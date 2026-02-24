import { create } from 'zustand';

type EditAudienceStore = {
	editSelectedAudience: Patchwork.ChannelAttributes[];
	setEditSelectedAudience: (audience: Patchwork.ChannelAttributes[]) => void;
	toggleEditAudience: (audience: Patchwork.ChannelAttributes) => void;
	removeHashtagFromEditAudience: (audienceId: string, hashtag: string) => void;
	clearEditSelectedAudience: () => void;
};

export const useEditAudienceStore = create<EditAudienceStore>((set, get) => ({
	editSelectedAudience: [],
	setEditSelectedAudience: audience => set({ editSelectedAudience: audience }),
	toggleEditAudience: audience => {
		const { editSelectedAudience } = get();
		const exists = editSelectedAudience.find(a => a.id === audience.id);
		set({
			editSelectedAudience: exists
				? editSelectedAudience.filter(a => a.id !== audience.id)
				: [...editSelectedAudience, audience],
		});
	},
	removeHashtagFromEditAudience: (audienceId, hashtag) => {
		const { editSelectedAudience } = get();
		const updatedAudience = editSelectedAudience
			.map(aud => {
				if (aud.id?.toString() === audienceId) {
					const updatedHashtags = aud.patchwork_community_hashtags?.filter(
						h => h.hashtag !== hashtag,
					);
					if (updatedHashtags?.length) {
						return { ...aud, patchwork_community_hashtags: updatedHashtags };
					}
					return null;
				}
				return aud;
			})
			.filter((a): a is Patchwork.ChannelAttributes => a !== null);
		set({ editSelectedAudience: updatedAudience });
	},
	clearEditSelectedAudience: () => set({ editSelectedAudience: [] }),
}));
