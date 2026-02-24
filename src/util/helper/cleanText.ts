import he from 'he';

export const cleanText = (htmlString: string) => {
	if (!htmlString) return '';
	// const withSpaces = htmlString.replace(/<br\s*\/?>|<\/?p>/gi, ' ');
	const withNewlines = htmlString
		.replace(/<br\s*\/?>/gi, '\n')
		.replace(/<\/?p>/gi, ' ');
	const withoutTags = withNewlines.replace(/<\/?[^>]+(>|$)/g, '');
	const decodedString = he.decode(withoutTags);
	return decodedString.trim();
};
