import { View } from 'react-native';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import Header from '@/components/atoms/common/Header/Header';
import { GuestStackScreenProps } from '@/types/navigation';
import BackButton from '@/components/atoms/common/BackButton/BackButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SignUpForm from '@/components/molecules/signUp/SignUpForm/SignUpForm';
import AlreadyHaveAcc from '@/components/molecules/login/AlreadyHaveAcc/AlreadyHaveAcc';
import { useTranslation } from 'react-i18next';
import LanguageSelectorModal from '@/components/molecules/account/LanguageSelectorModal/LanguageSelectorModal';

const SignUp: React.FC<GuestStackScreenProps<'SignUp'>> = ({ navigation }) => {
	const { t } = useTranslation();
	return (
		<SafeScreen>
			<KeyboardAwareScrollView
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
			>
				<Header
					hideUnderline
					title={t('screen.sign_up')}
					leftCustomComponent={<BackButton />}
				/>
				<View className="px-8">
					<SignUpForm />
				</View>
				<AlreadyHaveAcc className="mt-4" />
			</KeyboardAwareScrollView>
			<View className='absolute bottom-8 right-4'><LanguageSelectorModal /></View>
		</SafeScreen>
	);
};

export default SignUp;
