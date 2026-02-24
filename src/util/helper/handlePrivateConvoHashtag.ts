const hashtag = '#privateconversation';

export const addPrivateConvoHashtag = (status: string): string => {
	return `${status.trim()} ${hashtag}`.trim();
};

export const removePrivateConvoHashtag = (status: string): string => {
	const regex = new RegExp(`\\s*${hashtag}\\b`, 'g');
	return status.replace(regex, '').trim();
};
