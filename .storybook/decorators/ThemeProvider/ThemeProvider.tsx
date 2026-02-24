import { View, Text } from 'react-native';
import React, { PropsWithChildren, useEffect } from 'react';
import { useColorScheme } from 'nativewind';

type Props = Theme & PropsWithChildren;

export const themeArgsType = {
	theme: {
		control: 'radio',
		options: ['light', 'dark'],
	},
};

export const themeArgs = {
	theme: 'dark',
};

export type Theme = {
	theme: 'light' | 'dark';
};

const ThemeProvider = ({ children, theme }: Props) => {
	const { setColorScheme } = useColorScheme();

	useEffect(() => {
		setColorScheme(theme);
	}, [theme]);

	return <View>{children}</View>;
};

export default ThemeProvider;
