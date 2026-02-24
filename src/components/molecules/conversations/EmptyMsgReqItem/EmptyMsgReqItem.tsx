import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import ConversationsListLoading from '@/components/atoms/loading/ConversationsListLoading';
import customColor from '@/util/constant/color';
import { AppIcons } from '@/util/icons/icon.common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

export const EmptyMsgReqItem = ({ isLoading }: { isLoading?: boolean }) => {
	const { t } = useTranslation();
	const { colorScheme } = useColorScheme();
	if (isLoading) {
		return Array(8)
			.fill(null)
			.map((_, index) => <ConversationsListLoading key={index} />);
	}
	return (
		<View className="flex-1 mt-32 items-center">
			<FontAwesomeIcon
				icon={AppIcons.noMessage}
				size={35}
				color={colorScheme == 'dark' ? '#fff' : '#000'}
			/>
			<ThemeText size={'md_16'} className="mt-5">
				{t('conversation.no_message_requests')}
			</ThemeText>
		</View>
	);
};
