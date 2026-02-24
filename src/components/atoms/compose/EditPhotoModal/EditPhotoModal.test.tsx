import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

// Mock everything possible
jest.mock('@react-native-async-storage/async-storage', () =>
	require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-video', () => {
	const { View } = require('react-native');
	const MockVideo = (props: any) => <View testID="video-player" {...props} />;
	return {
		__esModule: true,
		default: MockVideo,
		ResizeMode: { COVER: 'cover', CONTAIN: 'contain', STRETCH: 'stretch' },
	};
});

jest.mock('nativewind', () => ({
	styled: (Component: any) => Component,
}));

jest.mock(
	'react-native-blurhash',
	() => ({
		Blurhash: 'Blurhash',
	}),
	{ virtual: true },
);

jest.mock('react-native-image-crop-picker', () => ({
	openCropper: jest.fn(() => Promise.resolve({ path: 'cropped-image-path' })),
}));

jest.mock('react-native-keyboard-aware-scroll-view', () => ({
	KeyboardAwareScrollView: ({ children }: any) => children,
}));

jest.mock('@d11/react-native-fast-image', () => {
	const { View } = require('react-native');
	return (props: any) => <View testID="fast-image" {...props} />;
});

jest.mock('react-i18next', () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@/components/atoms/common/ThemeModal/ThemeModal', () => {
	const { View, Button, Text } = require('react-native');
	return ({ visible, onClose, confirm, children, title }: any) =>
		visible ? (
			<View testID="theme-modal">
				<Text testID="modal-title">{title}</Text>
				{children}
				<Button
					title={confirm.text || 'Confirm'}
					onPress={confirm.onPress}
					testID="modal-confirm-btn"
				/>
				<Button title="Close" onPress={onClose} testID="modal-close-btn" />
			</View>
		) : null;
});

jest.mock('@/components/atoms/common/ThemeText/ThemeText', () => ({
	ThemeText: ({ children, ...props }: any) => {
		const { Text } = require('react-native');
		return <Text {...props}>{children}</Text>;
	},
}));

jest.mock('../../common/TextInput/TextInput', () => {
	const { TextInput } = require('react-native');
	return (props: any) => <TextInput testID="alt-text-input" {...props} />;
});

jest.mock('../../common/Checkbox/Checkbox', () => {
	const { TouchableOpacity, Text } = require('react-native');
	return ({ isChecked, handleOnCheck, children }: any) => (
		<TouchableOpacity onPress={handleOnCheck} testID="sensitive-checkbox">
			<Text>{isChecked ? 'Checked' : 'Unchecked'}</Text>
			{children}
		</TouchableOpacity>
	);
});

jest.mock('@/util/helper/helper', () => ({
	getFileNameFromUri: (uri: string) => 'filename.jpg',
	handleError: jest.fn(),
}));

jest.mock('@/util/helper/compose', () => ({
	prepareComposePayload: jest.fn(() => ({})),
}));

jest.mock('@/store/feed/activeDomain', () => ({
	useSelectedDomain: () => 'example.com',
}));

jest.mock('@/store/auth/authStore', () => ({
	useAuthStore: () => ({ userInfo: { id: 'user1' } }),
}));

jest.mock('@/App', () => ({
	queryClient: {
		invalidateQueries: jest.fn(),
	},
}));

jest.mock('@/util/cache/statusActions/editStatusCache', () => ({
	editedStatusCacheData: jest.fn(),
}));

jest.mock('@/util/helper/twutil', () => ({
	cn: (...args: any[]) => args.join(' '),
}));

jest.mock('@/util/helper/isTablet', () => ({
	isTablet: false,
}));

jest.mock('@/util/cache/queryCacheHelper', () => ({
	getCacheQueryKeys: jest.fn(() => ['mock-query-key']),
}));

jest.mock('../ImageCard/ImageCard', () => ({
	isAsset: jest.fn(() => false),
}));

const mockCloseEditPhotoModal = jest.fn();
jest.mock('@/store/compose/editPhotoMeta/editPhotoMeta', () => ({
	useEditPhotoMeta: () => ({
		selectedPhoto: { id: '1', sensitive: false },
	}),
	useEditPhotoMetaActions: () => ({
		closeEditPhotoModal: mockCloseEditPhotoModal,
	}),
}));

const mockOnReplaceMedia = jest.fn();
jest.mock('@/store/compose/manageAttachments/manageAttachmentStore', () => ({
	useManageAttachmentStore: () => ({
		selectedMedia: [
			{
				id: '1',
				type: 'image',
				preview_url: 'http://example.com/img.jpg',
				description: '',
				sensitive: false,
			},
		],
	}),
	useManageAttachmentActions: () => ({
		onReplaceMedia: mockOnReplaceMedia,
	}),
}));

const mockComposeDispatch = jest.fn();
jest.mock('@/context/composeStatusContext/composeStatus.context', () => ({
	useComposeStatus: () => ({
		composeState: {},
		composeDispatch: mockComposeDispatch,
	}),
}));

const mockMediaAttachmentMutation = jest.fn();
const mockComposeMutation = jest.fn();
const mockUploadComposeImageMutation = jest.fn();

jest.mock('@/hooks/mutations/feed.mutation', () => ({
	useMediaAttachmentMutation: () => ({
		mutateAsync: mockMediaAttachmentMutation,
		isPending: false,
	}),
	useComposeMutation: ({ onSuccess }: any) => ({
		mutate: (args: any) => {
			mockComposeMutation(args);
			if (onSuccess) onSuccess({ id: 'status1', account: { id: 'user1' } });
		},
		isPending: false,
	}),
	useUploadComposeImageMutation: ({ onSuccess }: any) => ({
		mutateAsync: async (args: any) => {
			mockUploadComposeImageMutation(args);
			if (onSuccess)
				onSuccess({ id: 'new-media-id' }, { image: { uri: 'new-uri' } });
			return { id: 'new-media-id' };
		},
		isPending: false,
	}),
}));

import EditPhotoModal from './EditPhotoModal';

describe('EditPhotoModal', () => {
	const mockOnClose = jest.fn();
	const mockIncomingStatus: any = { id: 'status1', sensitive: false };

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders correctly for image', () => {
		const { getByTestId, getByPlaceholderText } = render(
			<EditPhotoModal
				onClose={mockOnClose}
				composeType="create"
				incomingStatus={null}
			/>,
		);

		expect(getByTestId('fast-image')).toBeTruthy();
		expect(
			getByPlaceholderText('compose.editPhotoModal.altPlaceholder'),
		).toBeTruthy();
	});

	it('updates sensitive checkbox', () => {
		const { getByTestId, getByText } = render(
			<EditPhotoModal
				onClose={mockOnClose}
				composeType="create"
				incomingStatus={null}
			/>,
		);

		const checkbox = getByTestId('sensitive-checkbox');
		expect(getByText('Unchecked')).toBeTruthy();

		fireEvent.press(checkbox);
		expect(getByText('Checked')).toBeTruthy();
	});

	it('handles alt text input', () => {
		const { getByPlaceholderText } = render(
			<EditPhotoModal
				onClose={mockOnClose}
				composeType="create"
				incomingStatus={null}
			/>,
		);

		const input = getByPlaceholderText('compose.editPhotoModal.altPlaceholder');
		fireEvent.changeText(input, 'New alt text');

		expect(input.props.value).toBe('New alt text');
	});

	it('submits changes updates media', async () => {
		mockMediaAttachmentMutation.mockResolvedValue({
			id: '1',
			description: 'New alt text',
			sensitive: true,
		});

		const { getByTestId, getByPlaceholderText } = render(
			<EditPhotoModal
				onClose={mockOnClose}
				composeType="create"
				incomingStatus={null}
			/>,
		);

		const input = getByPlaceholderText('compose.editPhotoModal.altPlaceholder');
		fireEvent.changeText(input, 'New alt text');

		const checkbox = getByTestId('sensitive-checkbox');
		fireEvent.press(checkbox);

		const confirmBtn = getByTestId('modal-confirm-btn');
		fireEvent.press(confirmBtn);

		await waitFor(() => {
			expect(mockMediaAttachmentMutation).toHaveBeenCalled();
			expect(mockOnReplaceMedia).toHaveBeenCalled();
			expect(mockCloseEditPhotoModal).toHaveBeenCalled();
			expect(mockComposeDispatch).toHaveBeenCalled();
		});
	});

	it('open cropper when edit button is pressed', async () => {
		const { getByText } = render(
			<EditPhotoModal
				onClose={mockOnClose}
				composeType="create"
				incomingStatus={null}
			/>,
		);

		const editButton = getByText('compose.editPhotoModal.edit');
		fireEvent.press(editButton);

		await waitFor(() => {
			const { openCropper } = require('react-native-image-crop-picker');
			expect(openCropper).toHaveBeenCalled();
		});
	});

	it('handles compose edit type', async () => {
		const { getByTestId } = render(
			<EditPhotoModal
				onClose={mockOnClose}
				composeType="edit"
				incomingStatus={mockIncomingStatus}
			/>,
		);

		const confirmBtn = getByTestId('modal-confirm-btn');
		fireEvent.press(confirmBtn);

		await waitFor(() => {
			expect(mockComposeMutation).toHaveBeenCalled();
			expect(mockCloseEditPhotoModal).toHaveBeenCalled();
		});
	});
});
