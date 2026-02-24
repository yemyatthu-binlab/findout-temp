import React from 'react';
import { View } from 'react-native';
import type { TextStyle } from 'react-native';
import { ThemeText } from '../ThemeText/ThemeText';
import FastImage from '@d11/react-native-fast-image';

const regexEmoji = /(:[A-Za-z0-9_]+:)/;

export interface Props {
	content?: string;
	emojis?: Patchwork.Emoji[];
	style?: TextStyle;
	color?: string;
}

const ParseEmojis: React.FC<Props> = ({ content, emojis, style, color }) => {
	if (!content) return null;

	return (
		<ThemeText style={style}>
			{emojis ? (
				content
					.split(regexEmoji)
					.filter(f => f)
					.map((str, i) => {
						if (str.match(regexEmoji)) {
							const emojiShortcode = str.split(regexEmoji)[1];
							const emojiIndex = emojis.findIndex(emoji => {
								return emojiShortcode === `:${emoji.shortcode}:`;
							});

							if (emojiIndex === -1) {
								return (
									<ThemeText key={emojiShortcode + i}>
										{emojiShortcode}
									</ThemeText>
								);
							} else {
								const uri = emojis[emojiIndex].url;
								return (
									<ThemeText key={emojiShortcode + i}>
										{i === 0 ? ' ' : undefined}
										<FastImage
											source={{ uri }}
											style={{ width: 18, height: 16 }}
											resizeMode="contain"
										/>
									</ThemeText>
								);
							}
						} else {
							return <ThemeText key={i}>{str}</ThemeText>;
						}
					})
			) : (
				<ThemeText>{content}</ThemeText>
			)}
		</ThemeText>
	);
};

export default ParseEmojis;
