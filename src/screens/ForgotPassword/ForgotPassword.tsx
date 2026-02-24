import BackButton from '@/components/atoms/common/BackButton/BackButton';
import { Button } from '@/components/atoms/common/Button/Button';
import CustomAlert from '@/components/atoms/common/CustomAlert/CustomAlert';
import Header from '@/components/atoms/common/Header/Header';
import TextInput from '@/components/atoms/common/TextInput/TextInput';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import { useForgotPWMutation } from '@/hooks/mutations/auth.mutation';
import { GuestStackScreenProps } from '@/types/navigation';
import { isTablet } from '@/util/helper/isTablet';
import { cn } from '@/util/helper/twutil';
import { forgetPWSchema } from '@/util/schema/forgotPwSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Flow } from 'react-native-animated-spinkit';

const ForgotPassword: React.FC<GuestStackScreenProps<'ForgotPassword'>> = ({
	navigation,
}) => {
	const { t } = useTranslation();
	const [alertState, setAlert] = useState({ isOpen: false, isSuccess: false });
	const [token, setToken] = useState('');

	const {
		control,
		handleSubmit,
		formState: { errors },
		getValues,
	} = useForm({
		resolver: yupResolver(forgetPWSchema(t)),
	});
	const { mutate, isPending } = useForgotPWMutation({
		onSuccess: async response => {
			setAlert({ isOpen: true, isSuccess: true });
			setToken(response.reset_password_token);
		},
		onError: error => {
			setAlert({ isOpen: true, isSuccess: false });
		},
	});

	const onSubmit = (data: any) => {
		if (!isPending) {
			mutate({ email: data.email });
		}
	};

	return (
		<SafeScreen>
			<Header
				hideUnderline
				title={t('screen.forgot_password')}
				leftCustomComponent={<BackButton />}
			/>
			<View className={cn('mx-8', isTablet ? 'w-[50%] self-center' : '')}>
				<Controller
					name="email"
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<View>
							<TextInput
								placeholder={t('login.email_address')}
								onChangeText={onChange}
								value={value}
								onBlur={onBlur}
								maxLength={40}
								extraContainerStyle="mb-6 mt-8"
								autoCorrect={false}
								keyboardType="email-address"
							/>
							{errors.email && (
								<ThemeText
									size="xs_12"
									variant={'textOrange'}
									className="-mt-4 mb-2"
								>
									{'*' + errors.email.message}
								</ThemeText>
							)}
						</View>
					)}
				/>
				<Button onPress={handleSubmit(onSubmit)} className="h-[48]">
					{isPending ? (
						<Flow size={25} color={'#fff'} />
					) : (
						<ThemeText className="text-white dark:text-white">
							{t('common.submit')}
						</ThemeText>
					)}
				</Button>
				<CustomAlert
					isVisible={alertState.isOpen}
					message={
						alertState.isSuccess
							? t('login.please_check_mail')!
							: t('common.record_not_found')!
					}
					title={alertState.isSuccess ? t('common.success') : t('common.error')}
					handleOk={() => {
						setAlert(prev => ({ ...prev, isOpen: false }));
						if (alertState.isSuccess) {
							navigation.navigate('ForgotPasswordOTP', {
								email: getValues('email'),
								reset_password_token: token,
							});
						}
					}}
					type={alertState.isSuccess ? 'success' : 'error'}
				/>
			</View>
		</SafeScreen>
	);
};
export default ForgotPassword;
