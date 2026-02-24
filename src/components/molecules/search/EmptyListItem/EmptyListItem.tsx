import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

export const EmptyListComponent = ({ isLoading }: { isLoading: boolean }) => {
	const { t } = useTranslation();
	return (
		<View className="flex-1 items-center mt-24">
			<ThemeText size={'md_16'}>{t('channel.no_channel_detail')}</ThemeText>
		</View>
	);
};
