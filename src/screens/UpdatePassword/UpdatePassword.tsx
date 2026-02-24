import BackButton from '@/components/atoms/common/BackButton/BackButton';
import { Button } from '@/components/atoms/common/Button/Button';
import CustomAlert from '@/components/atoms/common/CustomAlert/CustomAlert';
import Header from '@/components/atoms/common/Header/Header';
import TextInput from '@/components/atoms/common/TextInput/TextInput';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import { useUpdatePasswordMutation } from '@/hooks/mutations/auth.mutation';
import { SettingStackScreenProps } from '@/types/navigation';
import { isTablet } from '@/util/helper/isTablet';
import { cn } from '@/util/helper/twutil';
import { getUpdatePasswordSchema } from '@/util/schema/updatePasswordSchema';
import { PasswordEyeCloseIcon, PasswordEyeIcon } from '@/util/svg/icon.common';
import { yupResolver } from '@hookform/resolvers/yup';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { Flow } from 'react-native-animated-spinkit';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const UpdatePassword: React.FC<SettingStackScreenProps<'UpdatePassword'>> = ({
	navigation,
	route,
}) => {
	const { t } = useTranslation();
	const [alertState, setAlert] = useState({
		isOpen: false,
		isSuccess: false,
		message: '',
	});
	const [pwVisibility, setPwVissibility] = useState({
		old_password: false,
		new_password: false,
		confirm_password: false,
	});
	const { colorScheme } = useColorScheme();

	const {
		control,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		resolver: yupResolver(getUpdatePasswordSchema(t)),
		mode: 'onChange',
	});
	const { mutate, isPending } = useUpdatePasswordMutation({
		onSuccess: async response => {
			setAlert({ isOpen: true, isSuccess: true, message: response.message });
		},
		onError: error => {
			setAlert({
				isOpen: true,
				isSuccess: false,
				message: error.message || t('common.error'),
			});
		},
	});

	const onSubmit = (data: any) => {
		if (!isPending) {
			mutate({
				current_password: data.currentPassword,
				password: data.newPassword,
				password_confirmation: data.repeatNewPassword,
			});
		}
	};

	return (
		<SafeScreen>
			<Header
				hideUnderline
				title={t('screen.change_password')}
				leftCustomComponent={<BackButton />}
			/>
			<KeyboardAwareScrollView
				className="mx-8 my-6"
				keyboardShouldPersistTaps={'handled'}
			>
				<View className={cn(isTablet ? 'w-[50%] self-center' : '')}>
					<Controller
						name="currentPassword"
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<View>
								<TextInput
									placeholder={t('login.current_password')}
									onChangeText={onChange}
									onBlur={onBlur}
									value={value}
									secureTextEntry={!pwVisibility.old_password}
									endIcon={
										<Pressable
											className="px-2 py-2 -mt-2 active:opacity-80"
											onPress={() =>
												setPwVissibility(prev => ({
													...prev,
													old_password: !prev.old_password,
												}))
											}
										>
											{pwVisibility.old_password ? (
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
									extraContainerStyle="mb-4"
								/>
								{errors.currentPassword && (
									<ThemeText
										size="xs_12"
										variant={'textOrange'}
										className="-mt-2 mb-2"
									>
										{'*' + errors.currentPassword.message}
									</ThemeText>
								)}
							</View>
						)}
					/>
					<Controller
						name="newPassword"
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<View>
								<TextInput
									placeholder={t('login.new_password')}
									onChangeText={onChange}
									onBlur={onBlur}
									value={value}
									secureTextEntry={!pwVisibility.new_password}
									endIcon={
										<Pressable
											className="px-2 py-2 -mt-2 active:opacity-80"
											onPress={() =>
												setPwVissibility(prev => ({
													...prev,
													new_password: !prev.new_password,
												}))
											}
										>
											{pwVisibility.new_password ? (
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
									extraContainerStyle="mb-4"
								/>
								{errors.newPassword && (
									<ThemeText
										size="xs_12"
										variant={'textOrange'}
										className="-mt-2 mb-2"
									>
										{'*' + errors.newPassword.message}
									</ThemeText>
								)}
							</View>
						)}
					/>
					<Controller
						name="repeatNewPassword"
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<View>
								<TextInput
									placeholder={t('login.repeat_password')}
									onChangeText={onChange}
									onBlur={onBlur}
									value={value}
									secureTextEntry={!pwVisibility.confirm_password}
									endIcon={
										<Pressable
											className="px-2 py-2 -mt-2 active:opacity-80"
											onPress={() =>
												setPwVissibility(prev => ({
													...prev,
													confirm_password: !prev.confirm_password,
												}))
											}
										>
											{pwVisibility.confirm_password ? (
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
									extraContainerStyle="mb-4"
								/>
								{errors.repeatNewPassword && (
									<ThemeText
										size="xs_12"
										variant={'textOrange'}
										className="-mt-2 mb-2"
									>
										{'*' + errors.repeatNewPassword.message}
									</ThemeText>
								)}
							</View>
						)}
					/>
					<Button
						onPress={handleSubmit(onSubmit)}
						className={cn('h-[48] mt-3', isValid ? '' : 'opacity-75')}
						disabled={!isValid}
					>
						{isPending ? (
							<Flow size={25} color={'#fff'} />
						) : (
							<ThemeText className="text-white dark:text-white">
								{t('common.submit')}
							</ThemeText>
						)}
					</Button>
				</View>
				<CustomAlert
					isVisible={alertState.isOpen}
					message={alertState.message}
					title={alertState.isSuccess ? t('common.success') : t('common.error')}
					extraTitleStyle="text-center text-white"
					extraOkBtnStyle={colorScheme == 'dark' ? 'text-white' : 'text-black'}
					handleCancel={() => {
						setAlert(prev => ({ ...prev, isOpen: false }));
					}}
					handleOk={() => {
						setAlert(prev => ({ ...prev, isOpen: false }));
						if (alertState.isSuccess) {
							navigation.goBack();
						}
					}}
					type={alertState.isSuccess ? 'success' : 'error'}
				/>
			</KeyboardAwareScrollView>
		</SafeScreen>
	);
};
export default UpdatePassword;
