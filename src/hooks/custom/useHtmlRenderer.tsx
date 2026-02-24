import { useRef } from 'react';
import { ElementType } from 'htmlparser2';
import type { ChildNode } from 'domhandler';
import { Platform } from 'react-native';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import ParseEmojis from '@/components/atoms/common/ParseEmojis/ParnseEmojis';
import { unwrapNode, shouldRenderHashtag } from '@/util/helper/htmlParserUtils';

type UseHtmlRendererProps = {
	status: Patchwork.Status;
	documentChildren: ChildNode[];
	isMainStatus?: boolean;
	continuedTagNames?: string[];
	onLinkPress: (url: string) => void;
	onHashtagPress: (tag: string) => void;
	onMentionPress: (mention: Patchwork.Mention) => void;
};

export const useHtmlRenderer = ({
	status,
	documentChildren,
	isMainStatus = false,
	continuedTagNames = [],
	onLinkPress,
	onHashtagPress,
	onMentionPress,
}: UseHtmlRendererProps) => {
	const isFirstLink = useRef(true);
	const adaptedLineheight = Platform.OS === 'ios' ? 18 : undefined;

	const isImageMissing = status?.media_attachments?.length !== 0;

	const renderNode = (node: ChildNode, index: number): React.ReactNode => {
		let classes: string | undefined;
		let href: string;

		switch (node?.type) {
			case ElementType.Text: {
				let content: string = node.data;

				if (node.data.trim().length) {
					content = node?.data.replace(/^\s+/, '');
				} else {
					content = node.data.trim();
				}

				return (
					<ParseEmojis emojis={status?.emojis} content={content} key={index} />
				);
			}

			case ElementType.Tag:
				switch (node.name) {
					case 'a':
						classes = node.attribs?.class;
						href = node.attribs?.href;

						if (classes) {
							if (classes.includes('hashtag')) {
								const children = node.children.map(unwrapNode).join('');
								const tagNameRaw = href?.match(/\/tags\/([^/?#]+)/)?.[1];

								const shouldRender = shouldRenderHashtag(
									tagNameRaw,
									node,
									documentChildren,
									continuedTagNames,
								);

								if (!shouldRender) {
									return null;
								}

								return (
									<ThemeText
										emojis={status.emojis}
										key={index}
										size={'fs_13'}
										className={`text-patchwork-flourish dark:text-patchwork-secondary`}
										children={`${children} `}
										onPress={() => onHashtagPress(children)}
									/>
								);
							}

							if (classes.includes('mention') && status?.mentions?.length) {
								const mentionedText = node.children.map(unwrapNode).join('');
								const normalizedMentionedText = mentionedText
									.trim()
									.toLowerCase();

								const matchedMention = (status?.mentions || []).find(
									(mention: Patchwork.Mention) => {
										return (
											`@${mention.acct}`.toLowerCase() ===
												normalizedMentionedText ||
											`@${mention.username}`.toLowerCase() ===
												normalizedMentionedText
										);
									},
								);

								return (
									<ThemeText
										key={index}
										size={isMainStatus ? 'default' : 'fs_13'}
										children={`${mentionedText} `}
										className="text-patchwork-primary dark:text-patchwork-soft-primary"
										onPress={() => {
											if (matchedMention) onMentionPress(matchedMention);
										}}
									/>
								);
							}
						}

						if (isImageMissing) {
							const contentNode = node.children
								.map(child => unwrapNode(child))
								.join('');

							return (
								<ThemeText
									key={index}
									className="text-patchwork-secondary"
									size="fs_13"
									children={`${contentNode} `}
									onPress={() => onLinkPress(href)}
								/>
							);
						}

						const nodeContent = node.children
							.map(child => unwrapNode(child))
							.join('');

						if (
							isFirstLink.current &&
							status?.is_meta_preview &&
							status?.card
						) {
							isFirstLink.current = false;
							return null;
						}

						return (
							<ThemeText
								key={index}
								size="fs_13"
								children={`${nodeContent} `}
								className="text-patchwork-secondary"
								onPress={() => onLinkPress(href)}
							/>
						);

					case 'br':
						return (
							<ThemeText
								key={index}
								style={{
									lineHeight: adaptedLineheight
										? adaptedLineheight / 2
										: undefined,
								}}
							>
								{'\n'}
							</ThemeText>
						);

					case 'p':
						const renderedChildren = node.children.map((c, i) =>
							renderNode(c, i),
						);

						if (
							status?.quote &&
							node.attribs?.class?.includes('quote-inline')
						) {
							return null;
						}

						// Check if paragraph is effectively empty
						if (
							renderedChildren.every(
								child =>
									child == null || (typeof child === 'string' && child === ''),
							)
						) {
							return null;
						}

						return (
							<ThemeText key={index}>
								{renderedChildren}
								{index < documentChildren.length - 1 && (
									<ThemeText
										style={{
											lineHeight: adaptedLineheight
												? adaptedLineheight / 2
												: undefined,
										}}
									>
										{'\n'}
										{'\n'}
									</ThemeText>
								)}
							</ThemeText>
						);

					default:
						return (
							<ThemeText
								key={index}
								children={node.children.map((c, i) => renderNode(c, i))}
							/>
						);
				}
		}
		return null;
	};

	return {
		renderNode,
		adaptedLineheight,
	};
};
