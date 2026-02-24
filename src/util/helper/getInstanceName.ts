export const getInstanceName = (url: string) => {
	const match = url.match(/\/\/([^/]+)/);
	return match ? `@${match[1]}` : '';
};
