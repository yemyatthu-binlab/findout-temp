import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import Header from '@/components/atoms/common/Header/Header';
import { GuestStackScreenProps } from '@/types/navigation';
import EmailLoginForm from '@/components/molecules/login/EmailLoginForm/EmailLoginForm';
import BackButton from '@/components/atoms/common/BackButton/BackButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTranslation } from 'react-i18next';
import NotMemberYet from '@/components/molecules/login/NotMemberYet/NotMemberYet';
import { useShowMastodonInstance } from '@/hooks/queries/auth.queries';

const Login: React.FC<GuestStackScreenProps<'Login'>> = ({ navigation }) => {
	const { t } = useTranslation();
	const { data: showJoinNowBtn } = useShowMastodonInstance();

	return (
		<SafeScreen>
			<Header
				hideUnderline
				title={t('screen.log_in')}
				leftCustomComponent={<BackButton />}
			/>
			<KeyboardAwareScrollView
				className="mx-8"
				keyboardShouldPersistTaps="handled"
			>
				<EmailLoginForm />
				{showJoinNowBtn?.data.display && <NotMemberYet className="mt-4" />}
			</KeyboardAwareScrollView>
		</SafeScreen>
	);
};

export default Login;
