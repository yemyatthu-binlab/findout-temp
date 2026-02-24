import { queryClient } from '@/App';
import BackButton from '@/components/atoms/common/BackButton/BackButton';
import Header from '@/components/atoms/common/Header/Header';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import {
	ThemeButton,
	ThemePreference,
} from '@/components/molecules/settings/ThemeButton/ThemeButton';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import { useChangeUserTheme } from '@/hooks/mutations/profile.mutation';
import { useUserThemeSetting } from '@/hooks/queries/profile.queries';
import { useAuthStore, useAuthStoreAction } from '@/store/auth/authStore';
import customColor from '@/util/constant/color';
import {
	generateAppopirateColor,
	removeThemeFromStorage,
	setThemeToStorage,
	ThemeValue,
} from '@/util/helper/helper';
import { MoonIcon, SunIcon } from '@/util/svg/icon.common';
import { useColorScheme } from 'nativewind';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View, Appearance as RNAppearance } from 'react-native';
import { Flow } from 'react-native-animated-spinkit';
import Toast from 'react-native-toast-message';

const Appearance = () => {
	const { t } = useTranslation();
	const { colorScheme, setColorScheme } = useColorScheme();
	const { data: userTheme, isFetching, isLoading } = useUserThemeSetting();
	const { userTheme: currentUserTheme } = useAuthStore();
	const { setUserTheme } = useAuthStoreAction();
	const systemTheme = RNAppearance.getColorScheme() as ThemeValue;

	const hasSynced = useRef(false);
	const [hasRefetched, setHasRefetched] = useState(false);

	const { mutate: changeTheme } = useChangeUserTheme({
		onMutate(variables) {
			const prev = queryClient.getQueryData<Patchwork.UserTheme>([
				'user-theme-setting',
			]);
			if (!prev) return;
			queryClient.setQueryData(['user-theme-setting'], {
				...prev,
				settings: {
					theme: {
						type: variables.theme,
					},
				},
			});
		},
		onError: async error => {
			Toast.show({
				type: 'errorToast',
				text1: error?.message || t('common.error'),
				position: 'top',
				topOffset: Platform.OS == 'android' ? 25 : 50,
			});
		},
	});

	const handleThemeChange = (preference: ThemePreference) => {
		changeTheme({ theme: preference });
		setUserTheme(preference);

		if (preference === 'light') {
			setColorScheme('light');
			setThemeToStorage('light');
		} else if (preference === 'dark') {
			setColorScheme('dark');
			setThemeToStorage('dark');
		} else {
			setColorScheme(systemTheme);
			removeThemeFromStorage();
		}
	};

	useEffect(() => {
		if (!userTheme || isLoading) return;

		if (isFetching) {
			setHasRefetched(true);
			return;
		}

		if (hasSynced.current || !hasRefetched) return;

		const apiSetting = userTheme.settings?.theme?.type as ThemePreference;
		const localSetting = currentUserTheme as ThemePreference;

		if (apiSetting !== localSetting) {
			handleThemeChange(localSetting);
		}

		hasSynced.current = true;
	}, [userTheme, isFetching, isLoading, currentUserTheme]);

	return (
		<SafeScreen>
			<Header
				title={t('screen.appearance')}
				leftCustomComponent={<BackButton />}
			/>
			<View className="mt-5 mx-5">
				<View className="flex-row items-center mb-4">
					{(() => {
						const effectiveTheme =
							colorScheme === undefined ? systemTheme : colorScheme;

						const Icon = effectiveTheme === 'dark' ? MoonIcon : SunIcon;
						const iconColor = effectiveTheme === 'dark' ? '#fff' : '#000';

						return <Icon size={20} color={iconColor} className="mr-2" />;
					})()}
					<ThemeText>{t('setting.appearance.theme')}</ThemeText>
				</View>

				{!isLoading ? (
					<View className="flex-row items-center mt-3">
						<ThemeButton
							label="setting.appearance.system"
							preference={undefined}
							activePreference={currentUserTheme as ThemePreference}
							onPress={() => handleThemeChange(undefined)}
							extraClassName=""
							systemTheme={systemTheme}
						/>
						<ThemeButton
							label="setting.appearance.light"
							preference="light"
							activePreference={currentUserTheme as ThemePreference}
							onPress={() => handleThemeChange('light')}
							extraClassName="border-x-0"
							systemTheme={systemTheme}
						/>
						<ThemeButton
							label="setting.appearance.dark"
							preference="dark"
							activePreference={currentUserTheme as ThemePreference}
							onPress={() => handleThemeChange('dark')}
							extraClassName=""
							systemTheme={systemTheme}
						/>
					</View>
				) : (
					<View className="flex-1 items-center justify-center mt-5">
						<Flow
							size={20}
							color={
								colorScheme === 'dark'
									? customColor['patchwork-primary-dark']
									: customColor['patchwork-primary']
							}
						/>
					</View>
				)}
			</View>
		</SafeScreen>
	);
};

export default Appearance;
