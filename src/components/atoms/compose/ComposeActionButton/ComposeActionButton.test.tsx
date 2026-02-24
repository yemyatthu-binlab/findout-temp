import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import ComposeActionButton from './ComposeActionButton';
import { View, Text } from 'react-native';

jest.mock('react-native-popover-view', () => {
	const { View } = require('react-native');
	const Popover = ({
		isVisible,
		children,
	}: {
		isVisible: boolean;
		children: React.ReactNode;
	}) => (isVisible ? <View testID="popover-content">{children}</View> : null);
	Popover.default = Popover;
	return Popover;
});

jest.mock('../../common/ThemeText/ThemeText', () => {
	const { Text } = require('react-native');
	return {
		ThemeText: ({ children }: { children: React.ReactNode }) => (
			<Text>{children}</Text>
		),
	};
});

describe('ComposeActionButton', () => {
	const mockOnPress = jest.fn();
	const defaultProps = {
		disabled: false,
		onPress: mockOnPress,
		extraClassName: 'test-class',
		icon: <View testID="mock-icon" />,
		helperText: 'Helper Text',
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders correctly with the provided icon', () => {
		render(<ComposeActionButton {...defaultProps} />);
		expect(screen.getByTestId('mock-icon')).toBeTruthy();
	});

	it('handles onPress correctly when not disabled', () => {
		render(<ComposeActionButton {...defaultProps} />);
		const button = screen.getByTestId('mock-icon').parent;
		fireEvent.press(screen.getByTestId('mock-icon'));
		expect(mockOnPress).toHaveBeenCalledTimes(1);
	});

	it('does not trigger onPress when disabled', () => {
		render(<ComposeActionButton {...defaultProps} disabled={true} />);
		fireEvent.press(screen.getByTestId('mock-icon'));
		expect(mockOnPress).not.toHaveBeenCalled();
	});

	it('shows popover with helper text on long press', () => {
		render(<ComposeActionButton {...defaultProps} />);
		expect(screen.queryByText('Helper Text')).toBeNull();
		fireEvent(screen.getByTestId('mock-icon'), 'longPress');
		expect(screen.getByText('Helper Text')).toBeTruthy();
	});

	it('passes extraClassName to the Pressable', () => {
		const { toJSON } = render(<ComposeActionButton {...defaultProps} />);
		expect(toJSON()).toMatchSnapshot();
	});
});
