import { StatusBar, View, ViewProps } from 'react-native';
import type { PropsWithChildren } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useColorScheme } from 'nativewind';
import useAppropiateColorHash from '@/hooks/custom/useAppropiateColorHash';
import { cn } from '@/util/helper/twutil';
import styles from './SafeScreen.style';

function SafeScreen({
	children,
	className: extraClassName,
	...props
}: PropsWithChildren & ViewProps) {
	const insets = useSafeAreaInsets();
	const { colorScheme } = useColorScheme();
	const barColor = useAppropiateColorHash('patchwork-dark-100');

	return (
		<View
			style={[
				{
					paddingTop: insets.top,
					// paddingBottom: insets.bottom,
					paddingLeft: insets.left,
					paddingRight: insets.right,
				},
			]}
			className={cn(styles.layoutContainer, extraClassName)}
			{...props}
		>
			<StatusBar
				barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
				// backgroundColor={barColor}
				translucent
				backgroundColor="transparent"
			/>
			{children}
		</View>
	);
}

export default SafeScreen;
