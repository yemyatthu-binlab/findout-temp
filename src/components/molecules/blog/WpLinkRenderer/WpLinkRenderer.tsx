import React from 'react';
import { Linking, Platform, Pressable, StyleSheet } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { useColorScheme } from 'nativewind';
import { CustomRendererProps, TNode } from 'react-native-render-html';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';

const WpLinkRenderer = ({
	tnode,
	TDefaultRenderer,
	...defaultRendererProps
}: CustomRendererProps<TNode>) => {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';
	const href = tnode.attributes.href;

	const handlePress = async () => {
		if (!href) return;

		try {
			if (await InAppBrowser.isAvailable()) {
				await InAppBrowser.open(href, {
					dismissButtonStyle: 'close',
					readerMode: false,
					animated: true,
					preferredBarTintColor: isDark ? '#000000' : '#ffffff',
					preferredControlTintColor: isDark ? '#ffffff' : '#000000',
				});
			} else {
				Linking.openURL(href);
			}
		} catch (error) {
			console.error('Failed to open link:', error);
			Linking.openURL(href);
		}
	};

	const { style } = defaultRendererProps;
	// const isBlock = tnode.styles.nativeTextFlow?.display === 'block';

	// if (isBlock) {
	// 	return (
	// 		<Pressable onPress={handlePress}>
	// 			<TDefaultRenderer tnode={tnode} {...defaultRendererProps} />
	// 		</Pressable>
	// 	);
	// }

	return (
		<ThemeText
			onPress={handlePress}
			style={[style, Platform.OS === 'android' && styles.androidLinkFix]}
		>
			<TDefaultRenderer tnode={tnode} {...defaultRendererProps} />
		</ThemeText>
	);
};

const styles = StyleSheet.create({
	androidLinkFix: {
		includeFontPadding: false,
		textAlignVertical: 'center',
	},
});

export default WpLinkRenderer;
