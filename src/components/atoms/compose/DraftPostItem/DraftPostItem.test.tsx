import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import DraftPostItem from './DraftPostItem';
import { useComposeStatus } from '@/context/composeStatusContext/composeStatus.context';
import { useDraftPostsActions } from '@/store/compose/draftPosts/draftPostsStore';
import { useManageAttachmentActions } from '@/store/compose/manageAttachments/manageAttachmentStore';
import { useDeleteDraft } from '@/hooks/mutations/feed.mutation';

jest.mock('@d11/react-native-fast-image', () => {
	const { View } = require('react-native');
	return (props: any) => <View testID="fast-image" {...props} />;
});

jest.mock('graphemer', () => {
	return jest.fn().mockImplementation(() => {
		return {
			countGraphemes: (str: string) => str.length,
			splitGraphemes: (str: string) => str.split(''),
		};
	});
});

jest.mock('@/components/atoms/common/ThemeText/ThemeText', () => ({
	ThemeText: ({ children, testID, ...props }: any) => {
		const { Text } = require('react-native');
		return (
			<Text testID={testID} {...props}>
				{children}
			</Text>
		);
	},
}));

jest.mock('@/util/svg/icon.common', () => ({
	DeleteIcon: () => {
		const { View } = require('react-native');
		return <View testID="delete-icon" />;
	},
}));

jest.mock('@/components/atoms/common/Underline/Underline', () => 'Underline');

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

const mockComposeDispatch = jest.fn();
jest.mock('@/context/composeStatusContext/composeStatus.context', () => ({
	useComposeStatus: () => ({
		composeState: {},
		composeDispatch: mockComposeDispatch,
	}),
}));

const mockSetDraftType = jest.fn();
const mockSetSelectedDraftId = jest.fn();
jest.mock('@/store/compose/draftPosts/draftPostsStore', () => ({
	useDraftPostsActions: () => ({
		setDraftType: mockSetDraftType,
		setSelectedDraftId: mockSetSelectedDraftId,
	}),
}));

const mockResetAttachmentStore = jest.fn();
const mockOnAddMedia = jest.fn();
jest.mock('@/store/compose/manageAttachments/manageAttachmentStore', () => ({
	useManageAttachmentActions: () => ({
		resetAttachmentStore: mockResetAttachmentStore,
		onAddMedia: mockOnAddMedia,
	}),
}));

const mockSetEditSelectedAudience = jest.fn();
jest.mock('@/store/compose/audienceStore/editAudienceStore', () => ({
	useEditAudienceStore: () => ({
		setEditSelectedAudience: mockSetEditSelectedAudience,
	}),
}));

const mockDeleteDraft = jest.fn();
jest.mock('@/hooks/mutations/feed.mutation', () => ({
	useDeleteDraft: ({ onMutate }: any) => ({
		mutate: (args: any) => {
			mockDeleteDraft(args);
		},
		isPending: false,
	}),
}));

jest.mock('@/hooks/queries/channel.queries', () => ({
	useFavouriteChannelLists: () => ({
		data: [],
	}),
}));

jest.mock('@/util/helper/compose', () => ({
	extractAllAudienceHashtags: jest.fn(() => []),
	getComposeUpdatePayload: jest.fn(() => ({ type: 'mock-payload' })),
}));

jest.mock('@/util/cache/compose/draftCache', () => ({
	removeDraftPostFromDraftList: jest.fn(),
}));

jest.mock('react-i18next', () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@/util/helper/helper', () => ({
	truncateStr: (str: string) => str,
}));

describe('DraftPostItem Component', () => {
	const mockItem: any = {
		id: '123',
		created_at: '2023-01-01T00:00:00Z',
		params: {
			text: 'Test draft content',
			sensitive: false,
			poll: null,
			spoiler_text: '',
		},
		media_attachments: [],
	};

	const mockOnClose = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders correctly with text and date', () => {
		const { getByText } = render(
			<DraftPostItem
				item={mockItem}
				index={0}
				date="2023-01-01"
				onClose={mockOnClose}
			/>,
		);

		expect(getByText('Test draft content')).toBeTruthy();
		expect(getByText('Jan 01, 2023')).toBeTruthy();
	});

	it('opens delete confirmation alert when delete icon is pressed', () => {
		const { getByTestId, queryByTestId, getByText } = render(
			<DraftPostItem
				item={mockItem}
				index={0}
				date="2023-01-01"
				onClose={mockOnClose}
			/>,
		);

		expect(queryByTestId('custom-alert')).toBeNull();

		const deleteIcon = getByTestId('delete-icon');
		fireEvent.press(deleteIcon);

		expect(getByTestId('custom-alert')).toBeTruthy();
		expect(getByText('timeline.draft.delete_alert')).toBeTruthy();
	});

	it('calls deleteDraft when deletion is confirmed', () => {
		const { getByTestId } = render(
			<DraftPostItem
				item={mockItem}
				index={0}
				date="2023-01-01"
				onClose={mockOnClose}
			/>,
		);

		const deleteIcon = getByTestId('delete-icon');
		fireEvent.press(deleteIcon);

		const confirmButton = getByTestId('alert-confirm-btn');
		fireEvent.press(confirmButton);

		expect(mockDeleteDraft).toHaveBeenCalledWith({ id: '123' });
	});

	it('populates compose state when draft is pressed', () => {
		const { getByText } = render(
			<DraftPostItem
				item={mockItem}
				index={0}
				date="2023-01-01"
				onClose={mockOnClose}
			/>,
		);

		const draftText = getByText('Test draft content');
		fireEvent.press(draftText);

		expect(mockSetSelectedDraftId).toHaveBeenCalledWith('123');
		expect(mockResetAttachmentStore).toHaveBeenCalled();
		expect(mockComposeDispatch).toHaveBeenCalled();
		expect(mockOnAddMedia).toHaveBeenCalledWith([]);
		expect(mockOnClose).toHaveBeenCalled();
		expect(mockSetDraftType).toHaveBeenCalledWith('update');
	});

	it('displays poll indicator if draft has poll', () => {
		const pollItem = {
			...mockItem,
			params: { ...mockItem.params, poll: { options: ['a', 'b'] } },
		};
		const { getByText } = render(
			<DraftPostItem
				item={pollItem}
				index={0}
				date="2023-01-01"
				onClose={mockOnClose}
			/>,
		);
		expect(getByText('timeline.draft.includes_poll')).toBeTruthy();
	});

	it('displays media attachment if present', () => {
		const mediaItem = {
			...mockItem,
			media_attachments: [
				{ id: 'm1', preview_url: 'http://example.com/img.jpg' },
			],
		};
		const { getByTestId } = render(
			<DraftPostItem
				item={mediaItem}
				index={0}
				date="2023-01-01"
				onClose={mockOnClose}
			/>,
		);
		expect(getByTestId('fast-image')).toBeTruthy();
	});
});
