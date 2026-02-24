import TextInput from '@/components/atoms/common/TextInput/TextInput';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { SectionList, View, Pressable } from 'react-native';
import { useGetCustomEmojis } from '@/hooks/queries/feed.queries';
import FastImage from '@d11/react-native-fast-image';
import { memo, useEffect, useMemo, useState } from 'react';
import useDebounce from '@/hooks/custom/useDebounce';
import { useComposeStatus } from '@/context/composeStatusContext/composeStatus.context';
import { useCursorStore } from '@/store/compose/cursorStore/cursorStore';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';

const CustomEmojiTab = ({ onClose }: { onClose: () => void }) => {
	const { colorScheme } = useColorScheme();
	const { t } = useTranslation();

	const { data } = useGetCustomEmojis();
	const [searchKeyword, setSearchKeyword] = useState('');
	const [finalKeyword, setFinalKeyword] = useState('');
	const startDebounce = useDebounce();
	const { composeDispatch } = useComposeStatus();
	const { selectionStart } = useCursorStore();

	useEffect(() => {
		startDebounce(() => {
			setFinalKeyword(searchKeyword);
		}, 200);
	}, [searchKeyword]);

	const categoryList = useMemo(() => {
		if (!data) return [];

		const categorizedEmojis: Record<string, Patchwork.CustomEmojis[]> = {};
		data.forEach(emoji => {
			if (!emoji.visible_in_picker) return;
			if (
				finalKeyword &&
				!emoji.shortcode.toLowerCase().includes(finalKeyword.toLowerCase())
			) {
				return;
			}
			const category = emoji.category || 'Others';
			if (!categorizedEmojis[category]) {
				categorizedEmojis[category] = [];
			}
			categorizedEmojis[category].push(emoji);
		});

		const result: { category: string; emojis: Patchwork.CustomEmojis[] }[] = [];

		for (const category in categorizedEmojis) {
			result.push({ category, emojis: categorizedEmojis[category] });
		}

		result.sort((a, b) => {
			if (a.category === 'Others') return 1;
			if (b.category === 'Others') return -1;
			return a.category.localeCompare(b.category);
		});

		return result;
	}, [data, finalKeyword]);

	const onPressEmoji = (emoji: Patchwork.CustomEmojis) => {
		onClose();
		startDebounce(() => {
			composeDispatch({
				type: 'add_emoji',
				payload: {
					emoji: ` :${emoji.shortcode}: `,
					position: selectionStart,
				},
			});
		}, 100);
	};

	return (
		<View className="flex-1 mt-2 px-4">
			<TextInput
				placeholder={t('compose.search_emoji')}
				extraContainerStyle="h-11"
				onChangeText={setSearchKeyword}
				value={searchKeyword}
				autoCapitalize="none"
			/>
			<SectionList
				showsVerticalScrollIndicator={false}
				sections={categoryList.map(group => ({
					title: group.category,
					data: [group.emojis],
				}))}
				keyExtractor={(item, index) => `${item[0]?.category}-${index}`}
				stickySectionHeadersEnabled={false}
				renderSectionHeader={({ section: { title } }) => (
					<ThemeText className="text-base font-NewsCycle_Bold mb-2 mt-4">
						{title}
					</ThemeText>
				)}
				renderItem={({ item }) => (
					<View className="flex-row flex-wrap gap-2">
						{item.map(emoji => (
							<Pressable
								key={emoji.shortcode}
								className="w-12 h-12 rounded-full items-center justify-center bg-neutral-100 dark:bg-neutral-800 active:opacity-80"
								onPress={() => onPressEmoji(emoji)}
							>
								<FastImage
									source={{ uri: emoji.url }}
									className="w-8 h-8 rounded-full"
									resizeMode="contain"
								/>
							</Pressable>
						))}
					</View>
				)}
				ListEmptyComponent={() => (
					<ThemeText className="text-center text-patchwork-grey-100 mt-4">
						{t('compose.no_custom_emojis')}
					</ThemeText>
				)}
			/>
		</View>
	);
};

export default memo(CustomEmojiTab);
