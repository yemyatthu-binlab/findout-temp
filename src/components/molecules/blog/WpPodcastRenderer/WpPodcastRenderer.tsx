import { View } from 'react-native';
import React from 'react';
import WebView from 'react-native-webview';
import { RenderersProps, TNode } from 'react-native-render-html';
import { useColorScheme } from 'nativewind';
import customColor from '@/util/constant/color';
import { cn } from '@/util/helper/twutil';

interface WpPodcastRendererProps {
	tnode: TNode;
}

const WpPodcastRenderer = ({ tnode }: RenderersProps) => {
	const { colorScheme } = useColorScheme();
	let src = tnode.attributes?.src;
	if (!src) return null;

	if (
		src.includes('share.transistor.fm/e/') &&
		!src.endsWith('/dark') &&
		colorScheme === 'dark'
	) {
		src = src.replace(/(share\.transistor\.fm\/e\/[^/?#]+)/, '$1/dark');
	}

	return (
		<View
			className={cn(
				'overflow-hidden  w-full h-[180] bg-slate-100 dark:bg-patchwork-dark-50 mb-4',
				src.includes('share.transistor.fm/e/') ? 'h-[180]' : 'h-[230]',
				{
					'rounded-xl': colorScheme === 'dark',
				},
			)}
		>
			<WebView
				source={{ uri: src }}
				style={{
					opacity: 0.99,
				}}
				className="flex-1 bg-slate-100 dark:bg-patchwork-dark-50"
				javaScriptEnabled
				domStorageEnabled
				allowsFullscreenVideo
			/>
		</View>
	);
};

export default WpPodcastRenderer;
