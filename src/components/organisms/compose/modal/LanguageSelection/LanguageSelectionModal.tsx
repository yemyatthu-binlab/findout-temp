import ThemeModal from '@/components/atoms/common/ThemeModal/ThemeModal';
import TextInput from '@/components/atoms/common/TextInput/TextInput';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import Underline from '@/components/atoms/common/Underline/Underline';
import { useComposeStatus } from '@/context/composeStatusContext/composeStatus.context';
import {
	useLanguageSelectionActions,
	useLanguageSelectionStore,
} from '@/store/compose/languageSelection/languageSelection';
import { languages } from '@/util/constant/languages';
import { ComposeCircleCheckIcon } from '@/util/svg/icon.compose';
import { FlashList } from '@shopify/flash-list';
import { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';

interface LanguageSelectionModalProps {
	openThemeModal: boolean;
	onCloseThemeModal: () => void;
}
const LanguageSelectionModal = ({
	openThemeModal,
	onCloseThemeModal,
}: LanguageSelectionModalProps) => {
	const { composeState, composeDispatch } = useComposeStatus();
	const { t } = useTranslation();
	const { colorScheme } = useColorScheme();

	const selectedLanguage = useLanguageSelectionStore(
		state => state.selectedLanguage,
	);
	const { setSelectedLanguage } = useLanguageSelectionActions();
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredData, setFilteredData] = useState(Object.entries(languages));

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		const lowerCaseQuery = query.toLowerCase();
		const filtered = Object.entries(languages).filter(
			([key, [language, native]]) =>
				language.toLowerCase().includes(lowerCaseQuery) ||
				native.toLowerCase().includes(lowerCaseQuery),
		);
		setFilteredData(filtered);
	};

	const onPressLanguageChange = (key: string) => {
		composeDispatch({ type: 'language', payload: key });
		setSelectedLanguage(key);
		onCloseThemeModal();
	};

	return (
		<ThemeModal
			onClose={onCloseThemeModal}
			type="simple"
			position="normal"
			visible={openThemeModal}
			title={t('compose.select_language')}
		>
			<View className="flex-1 mt-2">
				<TextInput
					placeholder={t('search.search')}
					onChangeText={handleSearch}
					value={searchQuery}
				/>
				<FlashList
					showsVerticalScrollIndicator={false}
					data={filteredData}
					renderItem={({ item: [key, [language, native]] }) => (
						<Pressable
							onPress={() => onPressLanguageChange(key)}
							className="py-4 px-3 rounded"
						>
							<View className="flex-row items-center justify-between">
								<ThemeText size={'sm_14'}>
									{native} ({language})
								</ThemeText>
								{key === selectedLanguage && (
									<ComposeCircleCheckIcon colorScheme={colorScheme} />
								)}
							</View>
						</Pressable>
					)}
					ItemSeparatorComponent={Underline}
				/>
			</View>
		</ThemeModal>
	);
};

export default LanguageSelectionModal;
