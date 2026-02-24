/* eslint-disable quotes */
import { render, screen } from '@testing-library/react-native';
import { MMKV } from 'react-native-mmkv';

import { TextStyle, ViewStyle } from 'react-native';
import TabItem from './TabItem';

describe('TabItem component should render correctly', () => {
	let storage: MMKV;

	beforeAll(() => {
		storage = new MMKV();
	});

	test("when current tab index value is equal to tab's index value, should display white background and black text", () => {
		const component = (
			<TabItem
				tab={{ value: '2', label: 'Phone' }}
				onTabPress={() => {}}
				currentTab="2"
			/>
		);

		render(component);

		const wrapper = screen.getByTestId('tabItem-wrapper');
		const text = screen.getByTestId('tabItem-text');

		expect((wrapper.props.style as ViewStyle[])[0].backgroundColor).toBe(
			'#ffffff',
		);
		expect((text.props.style as TextStyle[])[1].color).toBe('#DFDFDF');
	});

	test("when current tab index value is not equal to tab's index value, should display black background and white text", () => {
		const component = (
			<TabItem
				tab={{ value: '1', label: 'Email' }}
				onTabPress={() => {}}
				currentTab="2"
			/>
		);

		render(component);

		const wrapper = screen.getByTestId('tabItem-wrapper');
		const text = screen.getByTestId('tabItem-text');

		expect((wrapper.props.style as ViewStyle[])[0].backgroundColor).toBe(
			'#585e62',
		);

		expect((text.props.style as TextStyle[])[1].color).toBe('#ffffff');
	});
});
