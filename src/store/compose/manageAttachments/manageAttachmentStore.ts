import { Asset } from 'react-native-image-picker';
import { create } from 'zustand';

type ManageAttachmentState = {
	mediaModal: boolean;
	selectedMedia: Asset[] | (Patchwork.Attachment & { processing?: boolean })[];
	progress: { currentIndex: number | undefined; progress: number };
	actions: {
		onToggleMediaModal: () => void;
		onSelectMedia: (media: Asset[] | Patchwork.Attachment[]) => void;
		onremoveMedia: (index: number) => void;
		onAddMedia: (media: Asset | Asset[] | Patchwork.Attachment[]) => void;
		onProgressChange: (progress: number) => void;
		onProgressIndexChange: (inde: number | undefined) => void;
		resetAttachmentStore: () => void;
		onReplaceMedia: (
			index: number,
			newMedia: Patchwork.Attachment | Asset,
		) => void;
		onMediaUploadSuccess: (
			index: number,
			attachment: Patchwork.Attachment,
		) => void;
		onMediaProcessingComplete: (
			index: number,
			attachment: Patchwork.Attachment,
		) => void;
	};
};

export const useManageAttachmentStore = create<ManageAttachmentState>()(
	set => ({
		mediaModal: false,
		selectedMedia: [],
		progress: { currentIndex: undefined, progress: 0 },
		actions: {
			onToggleMediaModal: () =>
				set(state => ({ mediaModal: !state.mediaModal })),
			onSelectMedia: media => set(() => ({ selectedMedia: media })),
			onremoveMedia: (removeIndex: number) =>
				set(state => {
					return {
						selectedMedia: state.selectedMedia.filter(
							(item, index) => index !== removeIndex,
						),
					};
				}),
			onAddMedia: media => {
				const normalizedMedia = Array.isArray(media) ? media : [media];
				return set(state => ({
					selectedMedia: [...state.selectedMedia, ...normalizedMedia],
				}));
			},
			onProgressChange: currentProgress =>
				set(state => ({
					progress: {
						currentIndex: state.progress?.currentIndex,
						progress: Math.max(state.progress?.progress, currentProgress),
					},
				})),
			onProgressIndexChange: currentIndex =>
				set(() => ({ progress: { currentIndex, progress: 0 } })),
			resetAttachmentStore: () =>
				set(() => ({
					mediaModal: false,
					selectedMedia: [],
					progress: { currentIndex: undefined, progress: 0 },
				})),
			onReplaceMedia: async (index, newMedia) => {
				set(state => {
					const updatedMedia = state.selectedMedia.map((currentItem, i) => {
						if (i === index) {
							return { ...currentItem, ...newMedia };
						}
						return currentItem;
					});

					return { selectedMedia: updatedMedia };
				});
			},

			onMediaUploadSuccess: (index, attachment) =>
				set(state => {
					const newMedia = [...state.selectedMedia];
					const mediaToUpdate = newMedia[index];

					if (mediaToUpdate) {
						const needsProcessing =
							attachment.type === 'video' || attachment.type === 'gifv';

						newMedia[index] = {
							...attachment,
							processing: needsProcessing,
						};
					}
					return { selectedMedia: newMedia };
				}),

			onMediaProcessingComplete: (index, attachment) =>
				set(state => {
					const newMedia = [...state.selectedMedia];
					const mediaToUpdate = newMedia[index] as Patchwork.Attachment;

					if (mediaToUpdate) {
						const localPreview =
							typeof mediaToUpdate.preview_url === 'string' &&
							(mediaToUpdate.preview_url.startsWith('file://') ||
								mediaToUpdate.preview_url.includes('https://media.tenor.com'))
								? mediaToUpdate.preview_url
								: undefined;

						newMedia[index] = {
							...attachment,
							description: (state.selectedMedia[index] as Patchwork.Attachment)
								? (state.selectedMedia[index] as Patchwork.Attachment)
										.description
								: attachment?.description,
							processing: false,
							preview_url: localPreview ?? attachment.preview_url,
						};
					}

					return { selectedMedia: newMedia };
				}),
		},
	}),
);

export const useManageAttachmentActions = () =>
	useManageAttachmentStore(state => state.actions);
