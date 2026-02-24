import { Button } from '@/components/atoms/common/Button/Button';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { Linking, View, ViewProps } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GuestStackParamList, RootStackParamList } from '@/types/navigation';
import { useTranslation } from 'react-i18next';

const NotMemberYet = ({ ...props }: ViewProps) => {
	const { t } = useTranslation();
	const navigation = useNavigation<StackNavigationProp<GuestStackParamList>>();
	return (
		<View className="flex flex-row items-center justify-center" {...props}>
			<ThemeText variant="textGrey">{t('login.not_a_member')}</ThemeText>
			<Button
				variant="outline"
				size={'sm'}
				className={'border-slate-400 ml-2 px-4 rounded-3xl'}
				onPress={() => Linking.openURL('https://thebristolcable.org/join/')}
			>
				<ThemeText size={'fs_13'} className="leading-5">
					{' '}
					{t('login.join_now')}
				</ThemeText>
			</Button>
		</View>
	);
};

export default NotMemberYet;
