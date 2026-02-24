import { View, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import React, {
	useState,
	useRef,
	useMemo,
	useCallback,
	memo,
	useEffect,
} from 'react';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import { useColorScheme } from 'nativewind';
import { EMOJI_CATEGORIES, EmojiData } from '@/util/constant/emojiData';
import customColor from '@/util/constant/color';
import colors from 'tailwindcss/colors';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { useComposeStatus } from '@/context/composeStatusContext/composeStatus.context';
import { useCursorStore } from '@/store/compose/cursorStore/cursorStore';
import { useEmojiStore } from '@/store/compose/frequentUsedEmojiStore/frequentUsedEmojiStore';
import Graphemer from 'graphemer';
import useDebounce from '@/hooks/custom/useDebounce';
import TextInput from '@/components/atoms/common/TextInput/TextInput';
import { useTranslation } from 'react-i18next';
import { getKeyByValue } from '@/util/helper/helper';

const EMOJI_COLUMNS = 8;
const SECTION_HEADER_HEIGHT = 35;
const BOTTOM_BAR_HEIGHT = 50;
const EMOJI_ITEM_SIZE = 45;
const splitter = new Graphemer();

type EmojiListItem =
	| { type: 'header'; title: string; key: string }
	| { type: 'emoji-row'; emojis: EmojiData[]; key: string };

interface Props {
	onClose: () => void;
}

const StandardEmojiTab = ({ onClose }: Props) => {
	const { t } = useTranslation();
	const { width } = useWindowDimensions();
	const { colorScheme } = useColorScheme();
	const flashListRef = useRef<FlashListRef<EmojiListItem>>(null);
	const bottomBarRef = useRef<ScrollView>(null);
	const isScrollingByPress = useRef(false);

	const [searchQuery, setSearchQuery] = useState('');
	const [activeCategory, setActiveCategory] = useState('recents');
	const { emojiList } = useEmojiStore();
	const { addEmoji } = useEmojiStore().actions;
	const { selectionStart } = useCursorStore();
	const { composeState, composeDispatch } = useComposeStatus();
	const startDebounce = useDebounce();

	const { listData, categoryLayouts, allCategories, visibleCategories } =
		useMemo(() => {
			const categories = [...EMOJI_CATEGORIES].map(c => ({ ...c }));

			const recentEmojisData: EmojiData[] = emojiList.standard.map(
				emojiStr => ({
					id: emojiStr,
					name: '',
					native: emojiStr,
					keywords: [],
				}),
			);

			categories[0] = { ...categories[0], data: recentEmojisData };

			let filteredCategories = categories;
			if (searchQuery) {
				filteredCategories = categories
					.map(category => ({
						...category,
						data: category.data.filter(
							emoji =>
								emoji.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
								emoji.keywords.some(k =>
									k.toLowerCase().includes(searchQuery.toLowerCase()),
								),
						),
					}))
					.filter(category => category.data.length > 0);
			} else {
				filteredCategories = categories.filter(
					category =>
						!(category.key === 'recents' && category.data.length === 0),
				);
			}

			const data: EmojiListItem[] = [];
			const layouts: { [key: string]: { offset: number; index: number } } = {};
			let currentOffset = 0;

			filteredCategories.forEach(category => {
				layouts[category.key] = { offset: currentOffset, index: data.length };
				data.push({
					type: 'header',
					title: category.title,
					key: `header-${category.key}`,
				});
				currentOffset += SECTION_HEADER_HEIGHT;

				for (let i = 0; i < category.data.length; i += EMOJI_COLUMNS) {
					data.push({
						type: 'emoji-row',
						emojis: category.data.slice(i, i + EMOJI_COLUMNS),
						key: `row-${category.key}-${i}`,
					});
					currentOffset += EMOJI_ITEM_SIZE;
				}
			});

			return {
				listData: data,
				categoryLayouts: layouts,
				allCategories: categories,
				visibleCategories: filteredCategories,
			};
		}, [emojiList.standard, searchQuery]);

	useEffect(() => {
		const firstCategory = emojiList.standard.length > 0 ? 'recents' : 'people';
		setActiveCategory(firstCategory);
	}, [emojiList.standard.length]);

	const handleEmojiPress = useCallback(
		(emoji: string) => {
			const newText =
				composeState.text.raw.slice(0, selectionStart) +
				emoji +
				composeState.text.raw.slice(selectionStart);
			onClose();
			startDebounce(() => {
				composeDispatch({
					type: 'text',
					payload: { count: splitter.countGraphemes(newText), raw: newText },
				});
				addEmoji({ type: 'standard', emoji });
			}, 100);
		},
		[
			composeState.text.raw,
			selectionStart,
			onClose,
			startDebounce,
			composeDispatch,
			addEmoji,
		],
	);

	const handleCategoryPress = useCallback(
		(categoryKey: string) => {
			isScrollingByPress.current = true;
			setActiveCategory(categoryKey);

			const layout = categoryLayouts[categoryKey];
			if (layout && flashListRef.current) {
				flashListRef.current.scrollToOffset({
					offset: layout.offset,
					animated: true,
				});
			}

			const timer = setTimeout(() => {
				isScrollingByPress.current = false;
			}, 1000);

			return () => clearTimeout(timer);
		},
		[categoryLayouts],
	);

	const onScroll = useCallback(
		(event: { nativeEvent: { contentOffset: { y: number } } }) => {
			if (isScrollingByPress.current || searchQuery) return;

			const yOffset = event.nativeEvent.contentOffset.y;

			let currentCategoryKey = visibleCategories[0]?.key || 'recents';
			for (const category of visibleCategories) {
				const layout = categoryLayouts[category.key];
				if (layout && yOffset >= layout.offset - SECTION_HEADER_HEIGHT / 2) {
					currentCategoryKey = category.key;
				} else if (layout) {
					break;
				}
			}

			if (activeCategory !== currentCategoryKey) {
				setActiveCategory(currentCategoryKey);
				const activeIndex = allCategories.findIndex(
					c => c.key === currentCategoryKey,
				);
				if (bottomBarRef.current && activeIndex !== -1) {
					bottomBarRef.current.scrollTo({
						x: activeIndex * (width / EMOJI_COLUMNS) - width / 3,
						animated: true,
					});
				}
			}
		},
		[
			activeCategory,
			categoryLayouts,
			width,
			searchQuery,
			visibleCategories,
			allCategories,
		],
	);

	const renderItem = useCallback(
		({ item }: { item: EmojiListItem }) => {
			if (item.type === 'header') {
				return (
					<View
						style={{ height: SECTION_HEADER_HEIGHT }}
						className="px-4 justify-center"
					>
						<ThemeText
							size={'sm_14'}
							className="font-NewsCycle_Bold text-gray-500 dark:text-gray-400"
						>
							{t(
								`compose.emoji_category.${getKeyByValue(
									emojiCategories,
									item.title,
								)}`,
							)}
						</ThemeText>
					</View>
				);
			}
			if (item.type === 'emoji-row') {
				return (
					<View style={{ height: EMOJI_ITEM_SIZE }} className="flex-row px-2">
						{item.emojis.map((emoji: EmojiData) => (
							<Pressable
								key={emoji.id}
								onPress={() => handleEmojiPress(emoji.native)}
								style={{
									width: width / EMOJI_COLUMNS,
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<ThemeText size={'xl_24'}>{emoji.native}</ThemeText>
							</Pressable>
						))}
					</View>
				);
			}
			return null;
		},
		[handleEmojiPress, width],
	);

	const getItemType = (item: EmojiListItem) => item.type;

	return (
		<View className="flex-1 bg-white dark:bg-patchwork-dark-100">
			<View className="p-2">
				<TextInput
					placeholder={t('compose.search_emoji')}
					extraContainerStyle="h-11"
					onChangeText={setSearchQuery}
					value={searchQuery}
					autoCapitalize="none"
				/>
			</View>

			{listData.length === 0 && (
				<View className="flex-1 items-center justify-center">
					<ThemeText className="text-neutral-500">
						{t('compose.no_standard_emojis')}
					</ThemeText>
				</View>
			)}

			{listData.length > 0 && (
				<FlashList
					ref={flashListRef}
					data={listData}
					renderItem={renderItem}
					getItemType={getItemType}
					onScroll={onScroll}
					scrollEventThrottle={16}
				/>
			)}

			{!searchQuery && (
				<View
					style={{ height: BOTTOM_BAR_HEIGHT }}
					className="bg-white dark:bg-patchwork-dark-100 dark:border-gray-700"
				>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						ref={bottomBarRef}
					>
						{allCategories.map(category => {
							if (category.key === 'recents' && category.data.length === 0)
								return null;
							return (
								<Pressable
									key={category.key}
									onPress={() => handleCategoryPress(category.key)}
									style={{
										width: width / EMOJI_COLUMNS,
										backgroundColor:
											activeCategory === category.key
												? colorScheme === 'dark'
													? colors.gray[900]
													: colors.slate[100]
												: 'transparent',
									}}
									className="items-center justify-center rounded-2xl mt-1"
								>
									<ThemeText size={'xl_20'}>{category.icon}</ThemeText>
								</Pressable>
							);
						})}
					</ScrollView>
				</View>
			)}
		</View>
	);
};

const emojiCategories = {
	recents: 'Frequently used',
	people: 'Smileys & people',
	nature: 'Animals & nature',
	foods: 'Food & drink',
	activity: 'Activity',
	places: 'Travel & places',
	objects: 'Objects',
	symbols: 'Symbols',
	flags: 'Flags',
	others: 'Others',
};

export default memo(StandardEmojiTab);
