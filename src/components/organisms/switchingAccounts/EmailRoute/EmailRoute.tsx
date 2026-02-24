import EmailLoginAnotherAccountForm from '@/components/molecules/loginAnotherAccount/EmailLoginAnotherAccountForm/EmailLoginAnotherAccountForm';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

export const EmailRoute = ({}: {}) => (
	<KeyboardAwareScrollView
		className="mx-8"
		keyboardShouldPersistTaps="handled"
		showsVerticalScrollIndicator={false}
	>
		<EmailLoginAnotherAccountForm />
	</KeyboardAwareScrollView>
);
