import { View, Text, Pressable } from 'react-native';
import React, { useState } from 'react';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
	DeleteAccountFormValues,
	deleteAccountSchema,
} from '@/util/schema/deleteAccountSchema';
import TextInput from '@/components/atoms/common/TextInput/TextInput';
import { PasswordEyeCloseIcon, PasswordEyeIcon } from '@/util/svg/icon.common';
import { useColorScheme } from 'nativewind';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from '@/components/atoms/common/Button/Button';
import { Flow } from 'react-native-animated-spinkit';
import { useTranslation } from 'react-i18next';

const DeleteAccountConfirmPassword = () => {
	const { t } = useTranslation();
	const [pwVisibility, setPwVissibility] = useState({
		password: false,
		repeat_password: false,
	});
	const { colorScheme } = useColorScheme();

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<DeleteAccountFormValues>({
		resolver: yupResolver(deleteAccountSchema),
		defaultValues: {
			currentPassword: '',
			repeatPassword: '',
		},
	});

	const onSubmit = (data: DeleteAccountFormValues) => {};

	return (
		<View className="mx-5 flex-1">
			<ThemeText className="mt-2 mb-5 mx-2">
				Provide your password to permently delete account.
			</ThemeText>
			<KeyboardAwareScrollView
				className="mx-2"
				keyboardShouldPersistTaps={'handled'}
			>
				<Controller
					name="currentPassword"
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<View>
							<TextInput
								placeholder="Enter password"
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
					name="repeatPassword"
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<View className="mt-1">
							<TextInput
								placeholder="Repeat password"
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
								extraContainerStyle="mb-4"
							/>
							{errors.repeatPassword && (
								<ThemeText
									size="xs_12"
									variant={'textOrange'}
									className="-mt-2 mb-2"
								>
									{'*' + errors.repeatPassword.message}
								</ThemeText>
							)}
						</View>
					)}
				/>
				<Button onPress={handleSubmit(onSubmit)} className="h-[48] mt-2">
					{false ? (
						<Flow size={25} color={'#fff'} />
					) : (
						<ThemeText className="text-white">{t('delete_account')}</ThemeText>
					)}
				</Button>
			</KeyboardAwareScrollView>
		</View>
	);
};

export default DeleteAccountConfirmPassword;
