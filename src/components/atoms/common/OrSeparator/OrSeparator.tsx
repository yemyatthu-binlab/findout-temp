import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { View, ViewProps } from 'react-native';
import styles from './OrSeparator.style';
import { useTranslation } from 'react-i18next';

const OrSeparator = (prop: ViewProps) => {
	const { t } = useTranslation();
	return (
		<View className={styles.separatorWrapper} {...prop}>
			<View className={styles.separatorLine} />
			<ThemeText className="mx-4">{t('common.or')}</ThemeText>
			<View className={styles.separatorLine} />
		</View>
	);
};

export default OrSeparator;
