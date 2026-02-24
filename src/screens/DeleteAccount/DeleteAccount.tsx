import BackButton from '@/components/atoms/common/BackButton/BackButton';
import Header from '@/components/atoms/common/Header/Header';
import DeleteAccountConfirmation from '@/components/molecules/account/DeleteAccountConfirmation/DeleteAccountConfirmation';
import DeleteAccountConfirmPassword from '@/components/molecules/account/DeleteAccountConfirmPassword/DeleteAccountConfirmPassword';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import { useState } from 'react';

const DeleteAccount = () => {
	const [accountDeletionStep, setAccountDeletionStep] = useState<
		'confirmation' | 'confirm-password'
	>('confirmation');
	return (
		<SafeScreen>
			<Header title="Delete account" leftCustomComponent={<BackButton />} />
			{accountDeletionStep == 'confirmation' && (
				<DeleteAccountConfirmation
					handleClick={() => {
						setAccountDeletionStep('confirm-password');
					}}
				/>
			)}
			{accountDeletionStep == 'confirm-password' && (
				<DeleteAccountConfirmPassword />
			)}
		</SafeScreen>
	);
};

export default DeleteAccount;
