export const checkSupportsNotiV2 = (version: string): boolean => {
	const [major, minor] = version.split('.')?.map(Number);
	return major > 4 || (major === 4 && minor >= 3);
};
