import { queryClient } from '@/App';
import BackButton from '@/components/atoms/common/BackButton/BackButton';
import Header from '@/components/atoms/common/Header/Header';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import { useChangeUserLocale } from '@/hooks/mutations/profile.mutation';
import { useGetUserLocale } from '@/hooks/queries/profile.queries';
import { useAuthStore } from '@/store/auth/authStore';
import { useLanguageStore, ILanguage } from '@/store/feed/languageStore';
import { useAppearanceStore } from '@/store/feed/textAppearanceStore';
import { DEFAULT_INSTANCE } from '@/util/constant';
import customColor from '@/util/constant/color';
import { TotalLanguageList } from '@/util/constant/language';
import { RadioButtonIcon } from '@/util/svg/icon.common';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, ScrollView, View } from 'react-native';
import { Circle } from 'react-native-animated-spinkit';
import Toast from 'react-native-toast-message';

const LanguageScreen = () => {
	const { t, i18n } = useTranslation();
	const { language, setLanguage } = useLanguageStore();
	const { colorScheme } = useColorScheme();
	const { userOriginInstance } = useAuthStore();
	const { setFontScale } = useAppearanceStore();
	const { data: currentUserLocale } = useGetUserLocale();

	useEffect(() => {
		if (
			currentUserLocale &&
			currentUserLocale['posting:default:language'] &&
			currentUserLocale['posting:default:language'] !== language
		) {
			setLanguage(currentUserLocale['posting:default:language'] as ILanguage);
		}
	}, [currentUserLocale]);

	const { mutate: changeLocale, isPending: isChangingLocale } =
		useChangeUserLocale({
			onSuccess: async (_data, variables) => {
				i18n.changeLanguage(variables.lang);
				queryClient.setQueryData(
					['user-locale'],
					(old: Patchwork.UserPreferences | undefined) => {
						if (!old) return old;
						return {
							...old,
							'posting:default:language': variables.lang,
						};
					},
				);
			},
			onError: async error => {
				console.error('Failed to change language:', error);
				Toast.show({
					type: 'errorToast',
					text1: error?.message || t('common.error'),
					position: 'top',
					topOffset: Platform.OS == 'android' ? 25 : 50,
				});
			},
		});

	const handleLanguageChange = (langCode: ILanguage) => {
		if (isChangingLocale) return;
		if (langCode === 'my') {
			setFontScale('medium');
		}
		setLanguage(langCode);
		userOriginInstance == DEFAULT_INSTANCE && changeLocale({ lang: langCode });
	};

	return (
		<SafeScreen>
			<Header
				title={t('setting.appearance.language')}
				leftCustomComponent={<BackButton />}
			/>
			<ScrollView>
				<View className="mt-5 mx-5 space-y-3">
					{TotalLanguageList.map(lang => {
						const isSelected = language === lang.code;

						return (
							<Pressable
								key={lang.code}
								onPress={() => handleLanguageChange(lang.code as ILanguage)}
								className="flex-row items-center justify-between p-4 bg-slate-100 dark:bg-zinc-800 rounded-lg"
							>
								<ThemeText style={lang.code == 'my' ? { lineHeight: 32 } : {}}>
									{lang.name}
								</ThemeText>
								{isChangingLocale && isSelected ? (
									<Circle
										size={20}
										className="py-3"
										color={
											colorScheme === 'dark'
												? customColor['patchwork-primary-dark']
												: customColor['patchwork-primary']
										}
									/>
								) : (
									<RadioButtonIcon
										isSelected={isSelected}
										color={colorScheme === 'dark' ? '#FFF' : '#000'}
									/>
								)}
							</Pressable>
						);
					})}
				</View>
			</ScrollView>
		</SafeScreen>
	);
};

export default LanguageScreen;
