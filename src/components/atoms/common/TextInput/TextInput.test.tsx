import { render, screen } from '@testing-library/react-native';
import { MMKV } from 'react-native-mmkv';

import { Pressable } from 'react-native';
import TextInput from './TextInput';

describe('TextInput component should render correctly', () => {
	let storage: MMKV;

	beforeAll(() => {
		storage = new MMKV();
	});

	test('when end icon value is present, should show icon', () => {
		const component = (
			<TextInput
				placeholder="Email address"
				endIcon={<Pressable onPress={() => {}}>E</Pressable>}
			/>
		);

		render(component);

		const endIcon = screen.getByTestId('end-icon-wrapper');

		expect(endIcon).toBeOnTheScreen();
	});
});
