import { View, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import TextInput from '@/components/atoms/common/TextInput/TextInput';
import { useColorScheme } from 'nativewind';
import { PasswordEyeCloseIcon, PasswordEyeIcon } from '@/util/svg/icon.common';
import { Button } from '@/components/atoms/common/Button/Button';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
	useGetSignUpAccessTokenMutation,
	useSignUpMutation,
} from '@/hooks/mutations/auth.mutation';
import { Flow } from 'react-native-animated-spinkit';
import { GuestStackParamList } from '@/types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import CustomAlert from '@/components/atoms/common/CustomAlert/CustomAlert';
import { SignUpFormType, getSignUpSchema } from '@/util/schema/signUpSchema';
import Checkbox from '@/components/atoms/common/Checkbox/Checkbox';
import { cn } from '@/util/helper/twutil';
import { isTablet } from '@/util/helper/isTablet';
import { Trans, useTranslation } from 'react-i18next';

const SignUpForm = () => {
	const { t, i18n } = useTranslation();
	const {
		control,
		handleSubmit,
		formState: { errors },
		getValues,
	} = useForm<SignUpFormType>({
		resolver: yupResolver(getSignUpSchema(t)),
	});
	const [signUpAccessToken, setSignUpAccessToken] = useState('');
	const [alertState, setAlert] = useState({
		message: '',
		isOpen: false,
		isErrorAlert: false,
	});
	const [isAgreeToTerms, setIsAgreeToTerms] = useState(false);
	const [shouldShake, setShouldShake] = useState(false);
	const navigation = useNavigation<StackNavigationProp<GuestStackParamList>>();
	const lineHeightStyle = i18n.language === 'my' ? { lineHeight: 32 } : {};

	const { mutateAsync, isPending } = useSignUpMutation({
		onSuccess: async response => {
			if (response.access_token) {
				navigation.navigate('SignUpOTP', {
					email: getValues('email'),
					signup_token: response.access_token,
				});
			}
		},
		onError: error => {
			return setAlert({
				message: error?.message || 'Something went wrong.',
				isErrorAlert: true,
				isOpen: true,
			});
		},
	});

	const { mutate: requestAccessToken } = useGetSignUpAccessTokenMutation({
		onSuccess: response => {
			setSignUpAccessToken(response.access_token);
		},
		onError: e => {
			// return setAlert({
			// 	message: e?.message || 'Something went wrong.',
			// 	isErrorAlert: true,
			// 	isOpen: true,
			// });
		},
	});

	const [pwVisibility, setPwVissibility] = useState({
		password: false,
		repeat_password: false,
	});

	const { colorScheme } = useColorScheme();

	useEffect(() => {
		if (!signUpAccessToken) {
			requestAccessToken();
		}
	}, []);

	const onSubmit = (data: SignUpFormType) => {
		if (!isAgreeToTerms) {
			setShouldShake(true);
			setTimeout(() => setShouldShake(false), 500);
			return;
		}
		if (!isPending && signUpAccessToken) {
			mutateAsync({
				email: data.email,
				username: data.username,
				password: data.repeatPassword,
				agreement: isAgreeToTerms,
				locale: 'en',
				access_token: signUpAccessToken,
			});
		}
	};

	return (
		<View className={cn(isTablet ? 'w-[50%] self-center' : '')}>
			<Controller
				name="email"
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<View>
						<TextInput
							placeholder={t('login.email')}
							onChangeText={onChange}
							value={value}
							onBlur={onBlur}
							inputMode="email"
							extraContainerStyle="mb-6 mt-8"
							autoCorrect={false}
							keyboardType="email-address"
						/>
						{errors.email && (
							<ThemeText
								size="xs_12"
								variant={'textOrange'}
								className="-mt-4 mb-4"
							>
								{'*' + errors.email.message}
							</ThemeText>
						)}
					</View>
				)}
			/>

			<Controller
				name={'username'}
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<View>
						<TextInput
							placeholder={t('login.username')}
							onChangeText={onChange}
							value={value}
							onBlur={onBlur}
							extraContainerStyle="mb-6"
						/>
						{errors.username && (
							<ThemeText
								size="xs_12"
								variant={'textOrange'}
								className="-mt-4 mb-4"
							>
								{'*' + errors.username.message}
							</ThemeText>
						)}
					</View>
				)}
			/>

			<Controller
				name="createPassword"
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<View>
						<TextInput
							placeholder={t('login.password')}
							onChangeText={onChange}
							onBlur={onBlur}
							value={value}
							secureTextEntry={!pwVisibility.password}
							endIcon={
								<Pressable
									className="px-2 py-2 -mt-2 active:opacity-80"
									onPress={() =>
										setPwVissibility(prev => ({
											...prev,
											password: !prev.password,
										}))
									}
								>
									{pwVisibility.password ? (
										<PasswordEyeIcon
											fill={colorScheme === 'dark' ? 'white' : 'gray'}
											className=""
										/>
									) : (
										<PasswordEyeCloseIcon
											fill={colorScheme === 'dark' ? 'white' : 'gray'}
										/>
									)}
								</Pressable>
							}
							extraContainerStyle="mb-6"
						/>
						{errors.createPassword && (
							<ThemeText
								size="xs_12"
								variant={'textOrange'}
								className="-mt-4 mb-4"
							>
								{'*' + errors.createPassword.message}
							</ThemeText>
						)}
					</View>
				)}
			/>

			<Controller
				name="repeatPassword"
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<View>
						<TextInput
							placeholder={t('login.repeat_password')}
							onChangeText={onChange}
							onBlur={onBlur}
							value={value}
							secureTextEntry={!pwVisibility.repeat_password}
							endIcon={
								<Pressable
									className="px-2 py-2 -mt-2 active:opacity-80"
									onPress={() =>
										setPwVissibility(prev => ({
											...prev,
											repeat_password: !prev.repeat_password,
										}))
									}
								>
									{pwVisibility.repeat_password ? (
										<PasswordEyeIcon
											fill={colorScheme === 'dark' ? 'white' : 'gray'}
											className=""
										/>
									) : (
										<PasswordEyeCloseIcon
											fill={colorScheme === 'dark' ? 'white' : 'gray'}
										/>
									)}
								</Pressable>
							}
							extraContainerStyle="mb-6"
						/>
						{errors.repeatPassword && (
							<ThemeText
								size="xs_12"
								variant={'textOrange'}
								className="-mt-4 mb-4"
							>
								{'*' + errors.repeatPassword.message}
							</ThemeText>
						)}
					</View>
				)}
			/>

			<Checkbox
				isChecked={isAgreeToTerms}
				handleOnCheck={() => {
					setIsAgreeToTerms(!isAgreeToTerms);
				}}
				shouldShake={shouldShake}
			>
				<ThemeText className="ml-2" style={lineHeightStyle}>
					<Trans
						i18nKey="login.agree_text"
						components={{
							tc: (
								<ThemeText
									onPress={() => {
										navigation.navigate('WebViewer', {
											url: 'https://thebristolcable.org/terms/',
											customTitle: 'Terms & Conditions',
										});
									}}
									className="active:opacity-80 underline"
								/>
							),
						}}
					/>
				</ThemeText>
			</Checkbox>
			<Button onPress={handleSubmit(onSubmit)} className="mt-6 mb-2 h-[48]">
				{isPending ? (
					<Flow size={25} color={'#fff'} />
				) : (
					<ThemeText className="text-white dark:text-white">
						{t('login.sign_up')}
					</ThemeText>
				)}
			</Button>

			<CustomAlert
				isVisible={alertState.isOpen}
				extraTitleStyle="dark:text-white text-center -ml-2"
				extraOkBtnStyle="dark:text-white"
				message={alertState.message}
				title={
					alertState.isErrorAlert ? t('common.error') : t('common.success')
				}
				handleCancel={() =>
					setAlert(prev => ({
						...prev,
						isOpen: false,
					}))
				}
				handleOk={() =>
					setAlert(prev => ({
						...prev,
						isOpen: false,
					}))
				}
				type="error"
			/>
		</View>
	);
};

export default SignUpForm;
