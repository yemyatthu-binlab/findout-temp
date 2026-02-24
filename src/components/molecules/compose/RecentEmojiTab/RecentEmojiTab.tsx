import { View, TouchableOpacity, FlatList } from 'react-native';
import { useComposeStatus } from '@/context/composeStatusContext/composeStatus.context';
import { useCursorStore } from '@/store/compose/cursorStore/cursorStore';
import { Dimensions } from 'react-native';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { useEmojiStore } from '@/store/compose/frequentUsedEmojiStore/frequentUsedEmojiStore';
import Graphemer from 'graphemer';
import useDebounce from '@/hooks/custom/useDebounce';
import { isTablet } from '@/util/helper/isTablet';
import { useTranslation } from 'react-i18next';

const screenWidth = Dimensions.get('window').width;
const splitter = new Graphemer();

const RecentEmojiTab = ({ onClose }: { onClose: () => void }) => {
	const { t } = useTranslation();
	const { emojiList } = useEmojiStore();
	const { selectionStart } = useCursorStore();
	const { addEmoji } = useEmojiStore().actions;
	const { composeState, composeDispatch } = useComposeStatus();
	const startDebounce = useDebounce();

	const handleEmojiPress = (emoji: string) => {
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
	};

	const renderEmojiItem = ({ item }: { item: any }) => (
		<TouchableOpacity
			onPress={() => handleEmojiPress(item)}
			className="flex items-center justify-center"
			style={{ width: screenWidth / 9, height: screenWidth / 9 }}
		>
			<ThemeText className="text-3xl">{item}</ThemeText>
		</TouchableOpacity>
	);

	if (emojiList.standard.length === 0) {
		return (
			<View className="flex-1 items-center justify-center">
				<ThemeText className="text-neutral-500">
					{t('no_recent_emojis')}
				</ThemeText>
			</View>
		);
	}

	return (
		<View className="flex-1 mt-2">
			<FlatList
				data={emojiList.standard}
				renderItem={renderEmojiItem}
				numColumns={isTablet ? 16 : 8}
				contentContainerStyle={{ paddingBottom: 16 }}
			/>
		</View>
	);
};

export default RecentEmojiTab;
