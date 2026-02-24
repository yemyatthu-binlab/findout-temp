import { ElementType } from 'htmlparser2';
import type { ChildNode } from 'domhandler';

/**
 * Utility function to unwrap content from child nodes.
 * Used for extracting text content from HTML nodes like `span`.
 */
export const unwrapNode = (node: ChildNode): string => {
	switch (node.type) {
		case ElementType.Text:
			return node.data;
		case ElementType.Tag: // ElementType.Tag is equivalent to "tag"
			if (node.name === 'span') {
				// Handle Mastodon invisible spans and ellipses
				if (node.attribs && node.attribs.class?.includes('invisible'))
					return '';
				if (node.attribs && node.attribs.class?.includes('ellipsis'))
					return `${node.children.map(child => unwrapNode(child)).join('')}...`;
			}
			return node.children.map(child => unwrapNode(child)).join('');
		default:
			return '';
	}
};

/**
 * Determines whether a hashtag link should be rendered inside the post body.
 *
 * Logic:
 * 1. If it's part of `continuedTagNames` (tags that might be displayed elsewhere, e.g., thread continuation), skip rendering.
 * 2. If it's the last paragraph and contains only hashtags, skip rendering (often used for tagging posts without integrating them into sentences).
 *
 * @param tagNameRaw - The raw tag name extracted from href (e.g., from `/tags/Friday`).
 * @param node - The current HTML node being processed.
 * @param documentChildren - The top-level children of the parsed HTML document.
 * @param continuedTagNames - A list of tag names to exclude.
 */
export const shouldRenderHashtag = (
	tagNameRaw: string | undefined,
	node: ChildNode,
	documentChildren: ChildNode[],
	continuedTagNames: string[] = [],
): boolean => {
	const tagName = tagNameRaw?.toLowerCase();
	const continuedTagsLower = continuedTagNames.map(t => t.toLowerCase());

	// Get all top-level paragraph nodes from the parsed HTML document
	const paragraphNodes =
		documentChildren?.filter(
			child => child.type === ElementType.Tag && child.name === 'p',
		) || [];

	// Find the index of the current hashtag's parent paragraph
	const parentIndex = paragraphNodes.findIndex(p => p === node.parent);

	// Check if this is the last paragraph
	const isLastParagraph =
		parentIndex !== -1 && parentIndex === paragraphNodes.length - 1;

	// Check if the paragraph contains only hashtags (and whitespace)
	// We need to cast parent to any or Element because ChildNode.parent is generalized as ParentNode in domhandler types
	const parent = node.parent as any;
	const isOnlyHashtagParagraph =
		parent &&
		parent.name === 'p' &&
		parent.children &&
		parent.children.every(
			(n: any) =>
				(n.type === ElementType.Tag &&
					n.name === 'a' &&
					n.attribs?.class?.includes('hashtag')) ||
				(n.type === ElementType.Text && !n.data.trim()),
		);

	if (
		(tagName && continuedTagsLower.includes(tagName)) ||
		(isLastParagraph && isOnlyHashtagParagraph)
	) {
		return false;
	}

	return true;
};
