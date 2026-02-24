import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

import { Text } from 'react-native';

describe('Button', () => {
	it('renders correctly', () => {
		const { getByText } = render(
			<Button>
				<Text>Click me</Text>
			</Button>,
		);
		expect(getByText('Click me')).toBeTruthy();
	});

	it('calls onPress when pressed', () => {
		const onPressMock = jest.fn();
		const { getByText } = render(
			<Button onPress={onPressMock}>
				<Text>Press Me</Text>
			</Button>,
		);
		fireEvent.press(getByText('Press Me'));
		expect(onPressMock).toHaveBeenCalledTimes(1);
	});

	it('renders disabled state correctly', () => {
		const onPressMock = jest.fn();
		const { getByText } = render(
			<Button disabled onPress={onPressMock}>
				<Text>Disabled</Text>
			</Button>,
		);
		// Note: React Native's Pressable with disabled prop might still fire events in some test setups unless explicitly checked,
		// but @testing-library handles it well mostly.
		fireEvent.press(getByText('Disabled'));
		expect(onPressMock).not.toHaveBeenCalled();
	});
});
