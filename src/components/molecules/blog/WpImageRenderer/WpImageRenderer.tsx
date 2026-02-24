import React from 'react';
import {
	Linking,
	Pressable,
	Text,
	useWindowDimensions,
	View,
} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { useColorScheme } from 'nativewind';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { CustomRendererProps, TNode, TText } from 'react-native-render-html';
import { extractedProps } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '@/types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import FastImage from '@d11/react-native-fast-image';

const WpImageRenderer = ({
	tnode,
	TDefaultRenderer,
	...defaultRendererProps
}: any) => {
	const src = tnode?.attributes?.src;
	const widthAttr = Number(tnode?.attributes?.width || 0);
	const heightAttr = Number(tnode?.attributes?.height || 0);
	const aspectRatio = widthAttr && heightAttr ? widthAttr / heightAttr : 1;

	const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
	const { width } = useWindowDimensions();
	return (
		<Pressable
			onPress={() =>
				navigation.navigate('ImageViewer', {
					id: src,
					imageUrls: [
						{ id: src, url: src, width: widthAttr, height: heightAttr },
					],
				})
			}
			className="items-center justify-center rounded-md mb-4"
		>
			<FastImage
				source={{ uri: src, priority: 'high' }}
				style={{
					width: width - 32,
					height: 'auto',
					borderRadius: 6,
					aspectRatio,
				}}
				className="bg-slate-200 dark:bg-patchwork-dark-50"
				resizeMode="cover"
			/>
		</Pressable>
	);
};

export default WpImageRenderer;
