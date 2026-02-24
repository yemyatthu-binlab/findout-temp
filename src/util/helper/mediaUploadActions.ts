import { CameraOptions, ImageLibraryOptions } from 'react-native-image-picker';

interface Action {
	title: string;
	options: CameraOptions | ImageLibraryOptions;
}

export const mediaUploadAction: Action = {
	title: 'Select Image or Video\n(mixed)',
	options: {
		selectionLimit: 4,
		mediaType: 'mixed',
		includeExtra: false,
	},
};
