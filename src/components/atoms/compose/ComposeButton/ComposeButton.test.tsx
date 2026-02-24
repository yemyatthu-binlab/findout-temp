import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ComposeButton from './ComposeButton';
import { useComposeLogic } from '../../../../hooks/custom/useComposeButtonLogic';

jest.mock('../../../../hooks/custom/useComposeButtonLogic', () => ({
	useComposeLogic: jest.fn(),
}));

jest.mock('../../common/ThemeText/ThemeText', () => {
	const { Text } = require('react-native');
	return {
		ThemeText: ({ children }: any) => <Text>{children}</Text>,
	};
});

jest.mock('react-native-animated-spinkit', () => {
	const { View } = require('react-native');
	return {
		Flow: () => <View testID="flow-spinner" />,
	};
});

describe('ComposeButton', () => {
	const mockHandleComposeStatus = jest.fn();
	const mockHandleUpdateSchedule = jest.fn();
	const mockDisabledComposeButton = jest.fn();

	const defaultMockReturn = {
		composeState: { schedule: null },
		isPending: false,
		isPublishingDraft: false,
		isUpdatingSchedule: false,
		handleComposeStatus: mockHandleComposeStatus,
		handleUpdateSchedule: mockHandleUpdateSchedule,
		disabledComposeButton: mockDisabledComposeButton,
		t: (key: string) => key,
	};

	beforeEach(() => {
		jest.clearAllMocks();
		(useComposeLogic as jest.Mock).mockReturnValue(defaultMockReturn);
		mockDisabledComposeButton.mockReturnValue(false);
	});

	it('renders correctly with default props', () => {
		const { getByText } = render(
			<ComposeButton statusId="123" composeType="create" />,
		);
		expect(getByText('timeline.post')).toBeTruthy();
	});

	it('renders "common.update" when composeType is "edit"', () => {
		const { getByText } = render(
			<ComposeButton statusId="123" composeType="edit" />,
		);
		expect(getByText('common.update')).toBeTruthy();
	});

	it('renders "screen.repost" when composeType is "repost"', () => {
		const { getByText } = render(
			<ComposeButton statusId="123" composeType="repost" />,
		);
		expect(getByText('screen.repost')).toBeTruthy();
	});

	it('renders schedule text when is_edting_previous_schedule is true', () => {
		(useComposeLogic as jest.Mock).mockReturnValue({
			...defaultMockReturn,
			composeState: {
				schedule: { is_edting_previous_schedule: true },
			},
		});

		const { getByText } = render(
			<ComposeButton statusId="123" composeType="schedule" />,
		);
		expect(getByText('common.update')).toBeTruthy();
	});

	it('renders "schedule" when composeType is schedule and not editing previous', () => {
		(useComposeLogic as jest.Mock).mockReturnValue({
			...defaultMockReturn,
			composeState: {
				schedule: { is_edting_previous_schedule: false },
			},
		});

		const { getByText } = render(
			<ComposeButton statusId="123" composeType="schedule" />,
		);
		expect(getByText('schedule')).toBeTruthy();
	});

	it('shows spinner when loading (isPending)', () => {
		(useComposeLogic as jest.Mock).mockReturnValue({
			...defaultMockReturn,
			isPending: true,
		});

		const { getByTestId } = render(
			<ComposeButton statusId="123" composeType="create" />,
		);
		expect(getByTestId('flow-spinner')).toBeTruthy();
	});

	it('calls handleComposeStatus when pressed and not editing schedule', () => {
		const { getByText } = render(
			<ComposeButton statusId="123" composeType="create" />,
		);

		fireEvent.press(getByText('timeline.post'));
		expect(mockHandleComposeStatus).toHaveBeenCalled();
		expect(mockHandleUpdateSchedule).not.toHaveBeenCalled();
	});

	it('calls handleUpdateSchedule when pressed and editing schedule', () => {
		(useComposeLogic as jest.Mock).mockReturnValue({
			...defaultMockReturn,
			composeState: {
				schedule: { is_edting_previous_schedule: true },
			},
		});

		const { getByText } = render(
			<ComposeButton statusId="123" composeType="schedule" />,
		);

		fireEvent.press(getByText('common.update'));
		expect(mockHandleUpdateSchedule).toHaveBeenCalled();
		expect(mockHandleComposeStatus).not.toHaveBeenCalled();
	});

	it('disables button when disabledComposeButton returns true', () => {
		mockDisabledComposeButton.mockReturnValue(true);

		const { getByTestId } = render(
			<ComposeButton statusId="123" composeType="create" />,
		);
		const button = getByTestId('compose-button');

		expect(button.props.accessibilityState.disabled).toBe(true);

		fireEvent.press(button);
		expect(mockHandleComposeStatus).not.toHaveBeenCalled();
	});
});
