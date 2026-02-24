import { Button } from '@/components/atoms/common/Button/Button';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { View, ViewProps } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GuestStackParamList, RootStackParamList } from '@/types/navigation';
import styles from './AlreadyHaveAcc.style';
import { useTranslation } from 'react-i18next';

const AlreadyHaveAcc = ({ ...props }: ViewProps) => {
	const { t } = useTranslation();
	const navigation = useNavigation<StackNavigationProp<GuestStackParamList>>();
	return (
		<View className={styles.wrapper} {...props}>
			<ThemeText variant="textGrey">{t('login.have_account')}</ThemeText>
			<Button
				variant="outline"
				size={'sm'}
				className={'border-slate-400 ml-2 px-4'}
				onPress={() => navigation.navigate('Login')}
			>
				<ThemeText size={'fs_13'} className="leading-5">
					{t('login.sign_in')}
				</ThemeText>
			</Button>
		</View>
	);
};

export default AlreadyHaveAcc;
