import { UpdateProfilePayload } from '@/types/queries/profile.type';
import { cleanText } from './cleanText';

// used to get the full social link
export const getFullSocialLink = (
	platform: string,
	username: string,
): string => {
	const platformURLs: Record<string, string> = {
		Website: '',
		Instagram: 'https://instagram.com/',
		Linkedin: 'https://www.linkedin.com/in/',
		Youtube: 'https://www.youtube.com/@',
		Facebook: 'https://www.facebook.com/',
		Reddit: 'https://www.reddit.com/user/',
		TikTok: 'https://www.tiktok.com/@',
		Twitch: 'https://www.twitch.tv/',
		Patreon: 'https://www.patreon.com/',
	};

	return platformURLs[platform]
		? `${platformURLs[platform]}${username}`
		: username;
};

export const extractUsername = (url: string | undefined): string | null => {
	const patterns: Record<string, RegExp> = {
		Instagram: /https?:\/\/instagram\.com\/([^/?]+)/,
		Linkedin: /https?:\/\/www\.linkedin\.com\/in\/([^/?]+)/,
		Youtube: /https?:\/\/www\.youtube\.com\/@([^/?]+)/,
		Facebook: /https?:\/\/www\.facebook\.com\/([^/?]+)/,
		Reddit: /https?:\/\/www\.reddit\.com\/user\/([^/?]+)/,
		TikTok: /https?:\/\/www\.tiktok\.com\/@([^/?]+)/,
		Twitch: /https?:\/\/www\.twitch\.tv\/([^/?]+)/,
		Patreon: /https?:\/\/www\.patreon\.com\/([^/?]+)/,
	};

	for (const [platform, regex] of Object.entries(patterns)) {
		const match = url?.match(regex);
		if (match) return match[1];
	}

	return null;
};

export const generateFieldsAttributes = (
	userInfo: Patchwork.Account,
	link: string,
	username: string,
	type: 'edit' | 'delete',
): UpdateProfilePayload['fields_attributes'] => {
	const platforms = new Set([
		'Website',
		'Instagram',
		'Linkedin',
		'Youtube',
		'Facebook',
		'Reddit',
		'TikTok',
		'Twitch',
		'Patreon',
	]);

	const updatedFields = userInfo?.fields.map(field => {
		if (platforms.has(field.name)) {
			let value = cleanText(field.value!) || '';

			if (type === 'delete' && link === field.name) {
				value = '';
			} else if (link === field.name && username) {
				value = getFullSocialLink(field.name, username);
			}
			return { name: field.name, value };
		}

		return { name: field.name, value: cleanText(field.value) };
	});

	const missingPlatforms = Array.from(platforms).filter(
		platform => !userInfo.fields.some(field => field.name === platform),
	);

	const platformDefaults = missingPlatforms.map(platform => ({
		name: platform,
		value:
			platform === link && username
				? getFullSocialLink(platform, username)
				: '',
	}));

	return [...updatedFields, ...platformDefaults];
};

export const generateSocialLinkURL = (name: string, value: string): string => {
	if (name === 'Website') {
		return value;
	}

	const baseUrl = `https://www.${name.toLocaleLowerCase()}.com`;

	switch (name) {
		case 'Reddit':
			return `${baseUrl}/u/${value}`;
		case 'Linkedin':
			return `${baseUrl}/in/${value}`;
		case 'Youtube':
		case 'TikTok':
			return `${baseUrl}/@${value}`;
		case 'Twitch':
			return `${baseUrl}.tv/${value}`;
		default:
			return `${baseUrl}/${value}`;
	}
};
