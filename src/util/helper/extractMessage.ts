import { isTag } from 'domhandler';
import { parseDocument } from 'htmlparser2';

/**
 * Removes the first @mention from the input string and returns the rest.
 * @param {string} input - The input string containing @mentions.
 * @returns {string} - The message text without the first mention.
 */
export function extractMessage(input: string): string {
	const output = input.replace(/@\S+\b/g, '').trim();
	return output;
}

export function extractMentionsFromHTML(
	html: string,
	userOriginInstance: string,
): string[] {
	const mentions: string[] = [];
	const dom = parseDocument(html);

	function traverse(node: any) {
		if (Array.isArray(node)) {
			node.forEach(traverse);
			return;
		}

		if (
			isTag(node) &&
			node.name === 'a' &&
			node.attribs?.class?.includes('mention') &&
			!node.attribs?.class?.includes('hashtag')
		) {
			const href = node.attribs.href;

			const username = getTextFromNode(node);
			const domain = href?.split('/')[2];
			const originDomain = userOriginInstance.split('/')[2];
			if (username && domain) {
				mentions.push(
					`@${username}${originDomain == domain ? '' : '@' + domain}`,
				);
			}
		}

		if (node.children) {
			node.children.forEach(traverse);
		}
	}

	function getTextFromNode(node: any): string | null {
		if (!node || !node.children) return null;
		for (const child of node.children) {
			if (
				child.type === 'tag' &&
				child.name === 'span' &&
				child.children?.[0]?.data
			) {
				return child.children[0].data.trim();
			}
		}
		return null;
	}

	traverse(dom);
	return mentions;
}
