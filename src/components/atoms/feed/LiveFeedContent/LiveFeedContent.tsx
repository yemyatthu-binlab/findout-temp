import React, { useMemo } from 'react';
import { View, Text, useWindowDimensions, Pressable } from 'react-native';
import RenderHTML, { MixedStyleDeclaration } from 'react-native-render-html';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { useColorScheme } from 'nativewind';
import { cleanHtmlContent, stripTags } from '@/util/helper/helper';

interface FeedContentProps {
	post: Patchwork.WPStory;
	isLandscape?: boolean;
	onNavigateToDetail?: () => void;
}

const LINE_HEIGHT = 22;
const PORTRAIT_LINES = 1;

export const LiveFeedContent: React.FC<FeedContentProps> = ({
	post,
	isLandscape = false,
	onNavigateToDetail,
}) => {
	const { width, height } = useWindowDimensions();
	const { colorScheme } = useColorScheme();
	const contentWidth = width - 32;

	const landscapeLines = height < 750 ? 5 : 11;

	const title = stripTags(post.title.rendered);
	const htmlContent = useMemo(
		() => cleanHtmlContent(post.content.rendered),
		[post.content.rendered],
	);

	const textColor = !isLandscape
		? 'white'
		: colorScheme === 'dark'
		? 'white'
		: 'black';

	const tagsStyles: Readonly<Record<string, MixedStyleDeclaration>> = useMemo(
		() => ({
			body: {
				whiteSpace: 'normal',
				color: textColor,
				fontSize: 15,
				lineHeight: LINE_HEIGHT,
			},
			p: {
				marginVertical: 0,
				padding: 0,
			},
			div: {
				marginVertical: 0,
			},
		}),
		[textColor],
	);

	const maxHeight =
		(isLandscape ? landscapeLines : PORTRAIT_LINES) * LINE_HEIGHT;

	return (
		<View className="px-4 pt-4 pb-1 justify-start">
			<ThemeText
				className="text-xl font-bold mb-3"
				style={{ color: textColor }}
			>
				{title}
			</ThemeText>

			<Pressable onPress={onNavigateToDetail}>
				<View style={{ maxHeight, overflow: 'hidden' }}>
					<RenderHTML
						contentWidth={contentWidth}
						source={{ html: htmlContent }}
						tagsStyles={tagsStyles}
						defaultTextProps={{ numberOfLines: undefined }}
						ignoredDomTags={['img', 'iframe', 'video', 'source', 'br']}
					/>
				</View>
				<Text className="text-[#999] mt-1 font-semibold text-sm">See more</Text>
			</Pressable>
		</View>
	);
};
