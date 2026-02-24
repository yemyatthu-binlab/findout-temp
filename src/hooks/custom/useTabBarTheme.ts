import customColor from '@/util/constant/color';
import useAppropiateColorHash from '@/hooks/custom/useAppropiateColorHash';
import { useColorScheme } from 'nativewind';

type UseTabBarThemeOptions = {
	indicatorStyle?: 'primary' | 'text';
};

export const useTabBarTheme = (
	options: UseTabBarThemeOptions = { indicatorStyle: 'text' },
) => {
	const { colorScheme } = useColorScheme();

	const barColor = useAppropiateColorHash('patchwork-dark-100');

	const tabBarTextColor = useAppropiateColorHash(
		'patchwork-light-900',
		'patchwork-dark-100',
	);

	const indicatorColor =
		options.indicatorStyle === 'primary'
			? colorScheme === 'dark'
				? customColor['patchwork-primary-dark']
				: customColor['patchwork-primary']
			: tabBarTextColor;

	return {
		barColor,
		tabBarTextColor,
		indicatorColor,
	};
};
