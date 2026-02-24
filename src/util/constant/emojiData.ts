import * as dataRaw from '@emoji-mart/data';
import { EmojiMartData } from '@emoji-mart/data';

// Cast the raw data to the correct type since the library's types are incorrect for the default export
const data = dataRaw as unknown as EmojiMartData;

export interface EmojiData {
	id: string;
	name: string;
	native: string;
	keywords: string[];
}

export interface EmojiCategory {
	key: string;
	title: string;
	icon: string;
	data: EmojiData[];
}

const orderedCategories: { key: string; title: string; icon: string }[] = [
	{ key: 'recents', title: 'Frequently used', icon: '🕒' },
	{ key: 'people', title: 'Smileys & people', icon: '😊' },
	{ key: 'nature', title: 'Animals & nature', icon: '🐻' },
	{ key: 'foods', title: 'Food & drink', icon: '🍔' },
	{ key: 'activity', title: 'Activity', icon: '⚽' },
	{ key: 'places', title: 'Travel & places', icon: '✈️' },
	{ key: 'objects', title: 'Objects', icon: '💡' },
	{ key: 'symbols', title: 'Symbols', icon: '💛' },
	{ key: 'flags', title: 'Flags', icon: '🚩' },
];

/**
 * Processes the raw emoji data from the library into a structured array
 *
 * @returns {EmojiCategory[]} An array of emoji categories, fully populated.
 */
function generateEmojiData(): EmojiCategory[] {
	const allEmojis = data.emojis;

	return orderedCategories.map(categoryInfo => {
		if (categoryInfo.key === 'recents') {
			return { ...categoryInfo, data: [] };
		}

		const category = data.categories.find(cat => cat.id === categoryInfo.key);

		if (!category) {
			return { ...categoryInfo, data: [] };
		}

		const emojiDetails = category.emojis
			.map(id => {
				const emoji = allEmojis[id];
				if (!emoji) return null;
				return {
					id: emoji.id,
					name: emoji.name,
					native: emoji.skins[0].native,
					keywords: emoji.keywords,
				};
			})
			.filter((emoji): emoji is EmojiData => !!emoji);

		return {
			key: categoryInfo.key,
			title: categoryInfo.title,
			icon: categoryInfo.icon,
			data: emojiDetails,
		};
	});
}

export const EMOJI_CATEGORIES: EmojiCategory[] = generateEmojiData();
