import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import DraftAlert from './DraftAlert';
import { BackHandler } from 'react-native';

jest.mock('@/App', () => ({
	queryClient: {
		invalidateQueries: jest.fn(),
	},
}));

const { queryClient } = require('@/App');

jest.mock('@react-native-clipboard/clipboard', () => ({
	setString: jest.fn(),
	getString: jest.fn(),
}));

jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('@d11/react-native-fast-image', () => 'FastImage');

jest.mock('@/App', () => ({
	queryClient: {
		invalidateQueries: jest.fn(),
	},
}));
jest.mock('../../../../App', () => ({
	queryClient: {
		invalidateQueries: jest.fn(),
	},
}));

jest.mock('@react-native-async-storage/async-storage', () =>
	require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const mockNavigation = {
	addListener: jest.fn(() => jest.fn()),
	removeListener: jest.fn(),
	goBack: jest.fn(),
	navigate: jest.fn(),
	dispatch: jest.fn(),
};
jest.mock('@react-navigation/native', () => ({
	useNavigation: () => mockNavigation,
}));

jest.mock('react-i18next', () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../common/CustomAlert/CustomAlert', () => {
	const { View, Text, Button } = require('react-native');
	return ({
		isVisible,
		title,
		message,
		handleOk,
		handleCancel,
		confirmBtnText,
	}: any) => {
		if (!isVisible) return null;
		return (
			<View testID="custom-alert">
				<Text>{title}</Text>
				<Text>{message}</Text>
				<Button
					title={confirmBtnText}
					onPress={handleOk}
					testID="alert-confirm-btn"
				/>
				<Button
					title="Cancel"
					onPress={handleCancel}
					testID="alert-cancel-btn"
				/>
			</View>
		);
	};
});

const mockSetDraftType = jest.fn();
const mockSetSelectedDraftId = jest.fn();
const mockComposeDispatch = jest.fn();
const mockResetAttachmentStore = jest.fn();
const mockValidate = jest.fn(); // queryClient.invalidateQueries
const mockClearEditSelectedAudience = jest.fn();

jest.mock('@/context/composeStatusContext/composeStatus.context', () => ({
	useComposeStatus: jest.fn(() => ({
		composeState: {
			status: 'test status',
			text: { raw: 'test text' },
			sensitive: false,
			spoilerText: '',
			visibility: 'public',
			media_ids: [],
			poll: null,
		},
		composeDispatch: mockComposeDispatch,
	})),
}));

jest.mock('@/store/compose/manageAttachments/manageAttachmentStore', () => ({
	useManageAttachmentActions: jest.fn(() => ({
		resetAttachmentStore: mockResetAttachmentStore,
	})),
}));

jest.mock('@/store/auth/authStore', () => ({
	useAuthStore: jest.fn(() => ({
		userOriginInstance: 'default_instance',
	})),
}));

jest.mock('@/store/compose/audienceStore/createAudienceStore', () => ({
	useCreateAudienceStore: jest.fn(() => ({
		selectedAudience: [],
	})),
}));

jest.mock('@/store/compose/audienceStore/editAudienceStore', () => ({
	useEditAudienceStore: jest.fn(() => ({
		editSelectedAudience: [],
		clearEditSelectedAudience: mockClearEditSelectedAudience,
	})),
}));

jest.mock('@/store/compose/draftPosts/draftPostsStore', () => ({
	useDraftPostsStore: jest.fn(() => ({
		draftType: 'create',
		selectedDraftId: null,
	})),
	useDraftPostsActions: jest.fn(() => ({
		setDraftType: mockSetDraftType,
		setSelectedDraftId: mockSetSelectedDraftId,
	})),
}));

// Mock Mutations
const mockSaveDraft = jest.fn();
const mockUpdateDraft = jest.fn();

jest.mock('@/hooks/mutations/feed.mutation', () => ({
	useSaveDraftMutation: (options: any) => ({
		mutate: (payload: any) => {
			mockSaveDraft(payload);
			options.onSettled && options.onSettled(true, null);
		},
		isPending: false,
	}),
	useUpdateSpecificDraftMutation: (options: any) => ({
		mutate: (payload: any) => {
			mockUpdateDraft(payload);
			options.onSettled && options.onSettled(true, null);
		},
		isPending: false,
	}),
}));

describe('DraftAlert', () => {
	const mockSetShowDraftAlert = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders nothing when showDraftAlert is false', () => {
		const { queryByTestId } = render(
			<DraftAlert
				showDraftAlert={false}
				setShowDraftAlert={mockSetShowDraftAlert}
				totalText=""
			/>,
		);
		expect(queryByTestId('custom-alert')).toBeNull();
	});

	it('renders alert when showDraftAlert is true', () => {
		const { getByTestId, getByText } = render(
			<DraftAlert
				showDraftAlert={true}
				setShowDraftAlert={mockSetShowDraftAlert}
				totalText="some text"
			/>,
		);
		expect(getByTestId('custom-alert')).toBeTruthy();
		expect(getByText('compose.draft.title')).toBeTruthy();
	});

	it('calls saveDraft mutation on confirmation (Create mode)', async () => {
		const { getByTestId } = render(
			<DraftAlert
				showDraftAlert={true}
				setShowDraftAlert={mockSetShowDraftAlert}
				totalText="some text"
			/>,
		);

		fireEvent.press(getByTestId('alert-confirm-btn'));

		expect(mockSaveDraft).toHaveBeenCalled();
		expect(mockResetAttachmentStore).toHaveBeenCalled();
		expect(mockComposeDispatch).toHaveBeenCalledWith({ type: 'clear' });
		expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
			queryKey: ['view-multi-draft'],
		});
		expect(mockNavigation.goBack).toHaveBeenCalled();
	});

	it('calls handleCancel/discard logic on cancel', () => {
		const { getByTestId } = render(
			<DraftAlert
				showDraftAlert={true}
				setShowDraftAlert={mockSetShowDraftAlert}
				totalText="some text"
			/>,
		);

		fireEvent.press(getByTestId('alert-cancel-btn'));

		expect(mockSetDraftType).toHaveBeenCalledWith('create');
		expect(mockSetShowDraftAlert).toHaveBeenCalledWith(false);
		expect(mockSetSelectedDraftId).toHaveBeenCalledWith(null);
		expect(mockNavigation.goBack).toHaveBeenCalled();
	});

	it('handles update draft scenario', () => {
		const {
			useDraftPostsStore,
		} = require('@/store/compose/draftPosts/draftPostsStore');
		useDraftPostsStore.mockReturnValue({
			draftType: 'update',
			selectedDraftId: '123',
		});

		const { getByTestId, getByText } = render(
			<DraftAlert
				showDraftAlert={true}
				setShowDraftAlert={mockSetShowDraftAlert}
				totalText="some text"
			/>,
		);

		expect(getByText('compose.draft.update')).toBeTruthy();

		fireEvent.press(getByTestId('alert-confirm-btn'));

		expect(mockUpdateDraft).toHaveBeenCalled();
	});

	it('registers back handler listener', () => {
		const spy = jest.spyOn(BackHandler, 'addEventListener');
		render(
			<DraftAlert
				showDraftAlert={false}
				setShowDraftAlert={mockSetShowDraftAlert}
				totalText="some text"
			/>,
		);
		expect(spy).toHaveBeenCalledWith('hardwareBackPress', expect.any(Function));
	});
});
