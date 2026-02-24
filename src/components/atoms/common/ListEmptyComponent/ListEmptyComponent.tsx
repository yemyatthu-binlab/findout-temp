import { AccountListIcon } from '@/util/svg/icon.common';
import { View, ViewProps } from 'react-native';
import { ThemeText } from '../ThemeText/ThemeText';
import { generateAppopirateColor } from '@/util/helper/helper';
import { useTranslation } from 'react-i18next';

type Props = {
	title?: string;
	subtitle?: string;
} & ViewProps;

const ListEmptyComponent = ({ title, subtitle, ...props }: Props) => {
	const { t } = useTranslation();
	return (
		<View className="flex items-center justify-center mt-20" {...props}>
			<AccountListIcon
				stroke={generateAppopirateColor({ light: '#000', dark: '#fff' })}
			/>
			<ThemeText className="font-NewsCycle_Bold mt-2">
				{title ?? t('common.no_statuses_found')}
			</ThemeText>
			{subtitle && (
				<ThemeText
					style={{ maxWidth: '65%' }}
					className="text-center mt-2 text-gray-400"
				>
					{subtitle}
				</ThemeText>
			)}
		</View>
	);
};

export default ListEmptyComponent;
