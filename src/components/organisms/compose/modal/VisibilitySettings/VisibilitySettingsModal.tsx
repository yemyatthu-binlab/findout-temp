import { useState } from 'react';
import { View, FlatList, ListRenderItem } from 'react-native';
import ThemeModal from '@/components/atoms/common/ThemeModal/ThemeModal';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import Underline from '@/components/atoms/common/Underline/Underline';
import VisibilitySettingsItem from '@/components/molecules/compose/VisibilitySettingsItem/VisibilitySettingsItem';
import { useVisibilitySettingsActions } from '@/store/compose/visibilitySettings/visibilitySettingsStore';
import { useComposeStatus } from '@/context/composeStatusContext/composeStatus.context';
import {
	getQuoteSettingsData,
	getVisibilitySettingsData,
	SettingsItemProps,
} from '@/util/constant/visibilitySettings';
import { useTranslation } from 'react-i18next';
import { QuotePolicy } from '@/context/composeStatusContext/composeStatus.type';
import { VisibilityTabButton } from '@/components/atoms/compose/VisibilityTabButton/VisibilityTabButton';

interface VisibilitySettingsModalProps {
	visible: boolean;
	onClose: () => void;
	isInEditMode?: boolean;
}

const VisibilitySettingsModal = ({
	visible,
	onClose,
	isInEditMode,
}: VisibilitySettingsModalProps) => {
	const { t } = useTranslation();
	const { setVisibility } = useVisibilitySettingsActions();
	const { composeState, composeDispatch } = useComposeStatus();

	const [activeTab, setActiveTab] = useState<'visibility' | 'quote'>(
		isInEditMode ? 'quote' : 'visibility',
	);

	const visibilitySettingsData = getVisibilitySettingsData(t);
	const quoteSettingsData = getQuoteSettingsData(t);

	const settingData =
		activeTab === 'visibility' ? visibilitySettingsData : quoteSettingsData;

	const handlePress = (item: SettingsItemProps) => {
		if (activeTab === 'visibility') {
			setVisibility(item.label);
			composeDispatch({ type: 'visibility_change', payload: item.icon });
			if (item.icon === 'private') {
				composeDispatch({ type: 'quote_policy_change', payload: 'nobody' });
			}
		} else {
			if (item.value) {
				composeDispatch({
					type: 'quote_policy_change',
					payload: item.value as QuotePolicy,
				});
			}
		}
		onClose();
	};

	const renderItem: ListRenderItem<SettingsItemProps> = ({ item }) => {
		let isSelected = false;
		let isDisabled = false;
		if (activeTab === 'visibility') {
			isSelected = composeState.visibility == item.icon;
		} else {
			isSelected = composeState.quote_approval_policy == item.value;
			if (composeState.visibility === 'private' && item.value !== 'nobody') {
				isDisabled = true;
			}
		}

		return (
			<VisibilitySettingsItem
				item={item}
				isSelected={isSelected}
				onPressVisibilitySettings={() => handlePress(item)}
				isDisabled={isDisabled}
			/>
		);
	};

	return (
		<ThemeModal
			visible={visible}
			onClose={onClose}
			type="custom"
			position="bottom"
			customModalContainterStyle={{
				bottom: 0,
				width: '95%',
				alignSelf: 'center',
				paddingBottom: 20,
				height: 450,
			}}
		>
			<View className="flex-1 bg-white dark:bg-patchwork-dark-100 rounded-t-xl overflow-hidden">
				<View className="flex-row mb-2">
					<VisibilityTabButton
						label={t('timeline.visibility.visibility_title')}
						tab="visibility"
						activeTab={activeTab}
						setActiveTab={isInEditMode ? () => {} : setActiveTab}
						disabled={isInEditMode}
					/>
					<VisibilityTabButton
						label={t('timeline.quote')}
						tab="quote"
						activeTab={activeTab}
						setActiveTab={setActiveTab}
						disabled={false}
					/>
				</View>

				<ThemeText size={'sm_14'} className="px-4 py-2 text-gray-500">
					{activeTab === 'visibility'
						? t('timeline.visibility.select_visibility')
						: t('timeline.visibility.select_quote')}
				</ThemeText>

				<FlatList
					data={settingData as []}
					renderItem={renderItem}
					keyExtractor={item => item.value || item.label}
					ItemSeparatorComponent={Underline}
					contentContainerStyle={{ paddingBottom: 20 }}
				/>
			</View>
		</ThemeModal>
	);
};

export default VisibilitySettingsModal;
