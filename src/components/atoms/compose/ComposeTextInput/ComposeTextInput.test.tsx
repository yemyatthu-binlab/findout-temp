import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('react-i18next', () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('nativewind', () => ({
	useColorScheme: jest.fn(() => ({ colorScheme: 'light' })),
}));

jest.mock('@/hooks/custom/useAppropiateColorHash', () =>
	jest.fn(() => '#000000'),
);

jest.mock('@/context/composeStatusContext/composeStatus.context', () => ({
	useComposeStatus: jest.fn(),
}));

jest.mock('@/store/auth/authStore', () => ({
	useAuthStore: jest.fn(),
}));

jest.mock('@/store/compose/cursorStore/cursorStore', () => ({
	useCursorStore: jest.fn(),
}));

jest.mock('../FormattedText/FormattedText', () => ({
	FormattedText: ({ text }: { text: string }) => <>{text}</>,
}));

jest.mock('@/util/helper/twutil', () => ({
	cn: (...args: any[]) => 'mocked-class-name',
}));

jest.mock('graphemer', () => {
	return {
		__esModule: true,
		default: class Graphemer {
			countGraphemes(text: string) {
				return text.length;
			}
		},
	};
});

import ComposeTextInput from './ComposeTextInput';
import { useComposeStatus } from '@/context/composeStatusContext/composeStatus.context';
import { useAuthStore } from '@/store/auth/authStore';
import { useCursorStore } from '@/store/compose/cursorStore/cursorStore';
import { useColorScheme } from 'nativewind';

describe('ComposeTextInput', () => {
	const mockComposeDispatch = jest.fn();
	const mockSetSelectionStart = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();

		(useColorScheme as jest.Mock).mockReturnValue({
			colorScheme: 'light',
		});

		(useComposeStatus as jest.Mock).mockReturnValue({
			composeState: {
				text: { raw: '', count: 0 },
				sensitive: false,
				spoilerText: '',
				schedule: { schedule_detail_id: null },
				disableUserSuggestionsModal: false,
				forceCloseUserModalOnDraft: false,
			},
			composeDispatch: mockComposeDispatch,
		});

		(useAuthStore as unknown as jest.Mock).mockReturnValue({
			userOriginInstance: 'default',
		});

		(useCursorStore as unknown as jest.Mock).mockReturnValue({
			setSelectionStart: mockSetSelectionStart,
		});
	});

	it('renders correctly', () => {
		const { getByPlaceholderText } = render(
			<ComposeTextInput testID="compose-input" />,
		);
		expect(getByPlaceholderText('compose.placeholder')).toBeTruthy();
	});

	it('handles text input changes', () => {
		const { getByPlaceholderText } = render(<ComposeTextInput />);
		const input = getByPlaceholderText('compose.placeholder');

		fireEvent.changeText(input, 'Hello World');

		expect(mockComposeDispatch).toHaveBeenCalledWith({
			type: 'text',
			payload: { count: 11, raw: 'Hello World' },
		});
	});

	it('renders spoiler input when sensitive is true', () => {
		(useComposeStatus as jest.Mock).mockReturnValue({
			composeState: {
				text: { raw: '', count: 0 },
				sensitive: true, // Enable sensitive mode
				spoilerText: '',
				schedule: { schedule_detail_id: null },
			},
			composeDispatch: mockComposeDispatch,
		});

		const { getByPlaceholderText } = render(<ComposeTextInput />);
		expect(getByPlaceholderText('compose.spoiler_placeholder')).toBeTruthy();
	});

	it('handles spoiler text changes', () => {
		(useComposeStatus as jest.Mock).mockReturnValue({
			composeState: {
				text: { raw: '', count: 0 },
				sensitive: true,
				spoilerText: '',
				schedule: { schedule_detail_id: null },
			},
			composeDispatch: mockComposeDispatch,
		});

		const { getByPlaceholderText } = render(<ComposeTextInput />);
		const spoilerInput = getByPlaceholderText('compose.spoiler_placeholder');

		fireEvent.changeText(spoilerInput, 'Spoiler Warning');

		expect(mockComposeDispatch).toHaveBeenCalledWith({
			type: 'spoilerText',
			payload: 'Spoiler Warning',
		});
	});

	it('updates selection start on selection change', () => {
		const { getByPlaceholderText } = render(<ComposeTextInput />);
		const input = getByPlaceholderText('compose.placeholder');

		fireEvent(input, 'selectionChange', {
			nativeEvent: { selection: { start: 5, end: 5 } },
		});

		expect(mockSetSelectionStart).toHaveBeenCalledWith(5);
	});
});
