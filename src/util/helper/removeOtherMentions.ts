export function removeOtherMentions(
	input: string,
	defaultInstance: string,
): string {
	const mentionPattern = /@(\w+)(@[\w.-]+)?/g;
	const urlPattern = /(https?:\/\/[^\s]+)/g;

	let firstMention: string | null = null;

	const parts = input.split(urlPattern);

	let modifiedText = parts
		.map(part => {
			if (urlPattern.test(part)) {
				return part;
			}

			return part.replace(mentionPattern, (match, username, instance) => {
				const fullMention = instance ? match : `${match}${defaultInstance}`;
				if (!firstMention) {
					firstMention = fullMention;
					return fullMention;
				}
				return '';
			});
		})
		.join('');

	if (!firstMention) {
		return input;
	}

	return `${modifiedText.trim()}`;
}
