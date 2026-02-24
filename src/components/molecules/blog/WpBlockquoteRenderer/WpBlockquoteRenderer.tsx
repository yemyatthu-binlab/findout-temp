import {
	DoubleQouteLeftIcon,
	DoubleQouteRightIcon,
} from '@/util/svg/icon.status_actions';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { View } from 'react-native';
import { RenderersProps } from 'react-native-render-html';

const WpBlockquoteRenderer = ({
	TDefaultRenderer,
	tnode,
	...props
}: RenderersProps) => {
	const { colorScheme } = useColorScheme();

	return (
		<View className="relative mb-6 mt-8 py-4">
			<View style={{ position: 'absolute', top: -40, left: -10 }}>
				<DoubleQouteLeftIcon
					width={60}
					height={60}
					stroke={colorScheme == 'dark' ? '#fff' : '#000'}
				/>
			</View>
			<View className="px-3">
				<TDefaultRenderer tnode={tnode} {...props} />
			</View>
			<View style={{ position: 'absolute', bottom: -10, right: -10 }}>
				<DoubleQouteRightIcon
					width={60}
					height={60}
					stroke={colorScheme == 'dark' ? '#fff' : '#000'}
				/>
			</View>
		</View>
	);
};

export default WpBlockquoteRenderer;
