import 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MMKV } from 'react-native-mmkv';
import { useEffect, useRef, useState } from 'react';
import { useColorScheme } from 'nativewind';
import ApplicationNavigator from './navigators/Application';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import {
	getThemeFromStorage,
	isDevelopment,
	ThemeValue,
} from './util/helper/helper';
import { useAuthStoreAction } from './store/auth/authStore';
import { Alert, Appearance, StatusBar, View } from 'react-native';
import { searchServerInstance, verifyAuthToken } from './services/auth.service';
import Toast from 'react-native-toast-message';
import { MenuProvider } from 'react-native-popup-menu';
import * as Sentry from '@sentry/react-native';
import { DEFAULT_INSTANCE } from './util/constant';
import SuccessToast from './components/atoms/common/SuccessToast/SuccessToast';
import ErrorToast from './components/atoms/common/ErrorToast/ErrorToast';
import { withStallion } from 'react-native-stallion';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import './i18n';
import { useTranslation } from 'react-i18next';
import {
	ILanguage,
	supportedLanguage,
	useLanguageStore,
} from './store/feed/languageStore';
import { throttle } from 'lodash';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useLanguageSelectionActions } from './store/compose/languageSelection/languageSelection';
import { getUserLocale, getUserSetting } from './services/profile.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchServerInstanceQueryKey } from './types/queries/auth.type';
import {
	addOrUpdateAccount,
	AuthState,
	getActiveAuthState,
	removeAccount,
} from './util/storage';
import { useAccounts } from './hooks/custom/useAccounts';
import { useAppConfigStore } from './store/appConfig/appConfigStore';
import { SystemBars } from 'react-native-edge-to-edge';
import Sound from 'react-native-sound';
import { Wander } from 'react-native-animated-spinkit';
import { useWhiteLabelImages } from './hooks/custom/useWhiteLabelImages';
import { Image } from 'react-native';

Sound.setCategory('Ambient', true);

Sentry.init({
	dsn: isDevelopment() ? undefined : process.env.DEFAULT_SENTRY_DSN,
	tunnel: '/tunnel',
	tracesSampleRate: 1.0,
	debug: false,
});

export const queryClient = new QueryClient();

export const storage = new MMKV();

const toastConfig = {
	successToast: ({ text1 }: any) => <SuccessToast text1={text1} />,
	errorToast: ({ text1 }: any) => <ErrorToast text1={text1} />,
};

function App() {
	const { colorScheme, setColorScheme } = useColorScheme();
	const { appIcon } = useWhiteLabelImages();
	const { i18n } = useTranslation();
	const { language, setLanguage, setDefaultGuestLanguage } = useLanguageStore();
	const { setSelectedLanguage } = useLanguageSelectionActions();
	const {
		setAuthState,
		setUserInfo,
		setUserOriginInstance,
		clearAuthState,
		setUserTheme,
		setSelectedTimeline,
	} = useAuthStoreAction();
	const [isLoading, setLoading] = useState(true);
	const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>();
	const { activeAccId } = useAccounts();
	const activeAppInfo = useAppConfigStore(state => state.activeAppInfo);

	const hasStartedInitialization = useRef(false);

	useEffect(() => {
		throttle(() => {
			if (language) {
				i18n.changeLanguage(language);
				setSelectedLanguage(language);
			}
		}, 1000)();
	}, [language]);

	const initializeApp = async () => {
		if (hasStartedInitialization.current) return;
		hasStartedInitialization.current = true;
		await initTheme();
		retrieveToken();
	};

	const initTheme = async () => {
		const savedTheme = await getThemeFromStorage();
		if (savedTheme) {
			setColorScheme(savedTheme);
			setResolvedTheme(savedTheme);
		} else {
			const systemTheme = Appearance.getColorScheme() as ThemeValue;
			setColorScheme(systemTheme);
			setResolvedTheme(systemTheme);
		}
	};

	const retrieveToken = async () => {
		const { access_token } = await getActiveAuthState();
		const domain =
			useAppConfigStore.getState().activeAppInfo?.baseUrl || DEFAULT_INSTANCE;

		if (!access_token)
			return handleLocaleIfAuthFail().finally(() => setLoading(false));

		try {
			const userInfo = await verifyAuthToken(access_token, domain);

			if (!userInfo) return handleLocaleIfAuthFail();

			// noted: for account switching flow
			const newAuthState: AuthState = {
				access_token: access_token,
				domain: domain,
				userInfo: {
					username: userInfo.username,
					displayName: userInfo.display_name,
					avatar: userInfo.avatar,
				},
			};

			await addOrUpdateAccount(newAuthState);

			setUserInfo(userInfo);
			setUserOriginInstance(domain);
			setAuthState({
				wordpress: { token: '' },
				mastodon: { token: access_token },
			});

			const userSetting = await getUserSetting();
			if (userSetting) {
				setSelectedTimeline(userSetting.settings?.user_timeline[0]);
			}
			const userPrefs = await getUserLocale();
			const lang = userPrefs?.['posting:default:language'];
			if (lang) setLanguage(lang as ILanguage);
		} catch {
			await handleLocaleIfAuthFail();
		} finally {
			setLoading(false);
		}
	};

	const handleLocaleIfAuthFail = async () => {
		if (activeAccId) {
			await removeAccount(activeAccId);
		}
		const targetDomain =
			useAppConfigStore.getState().activeAppInfo?.baseUrl || DEFAULT_INSTANCE;

		const defaultInstance = await queryClient.fetchQuery<
			Patchwork.Instance_V2,
			Error,
			Patchwork.Instance_V2,
			SearchServerInstanceQueryKey
		>({
			queryKey: ['search-server-instance', { domain: targetDomain }],
			queryFn: searchServerInstance,
		});
		const isDefaultLocaleSupported = supportedLanguage.includes(
			defaultInstance.languages[0],
		);
		const serverLocale = isDefaultLocaleSupported
			? defaultInstance.languages[0]
			: 'en';

		setDefaultGuestLanguage(serverLocale as ILanguage);
		const storedLanguage = await AsyncStorage.getItem(
			'language-settings-storage',
		);

		if (!storedLanguage && defaultInstance?.languages?.[0]) {
			setLanguage(serverLocale as ILanguage);
			if (!isDefaultLocaleSupported) {
				Alert.alert(
					'Language Not Supported',
					`Your server's default language "${defaultInstance.languages[0]}" is not supported. "en" will be automatically set as the default.`,
					[{ text: 'OK', onPress: () => {} }],
					{ cancelable: true },
				);
			}
		}
	};

	useEffect(() => {
		if (resolvedTheme) {
			setUserTheme(resolvedTheme);
		}
	}, [resolvedTheme]);

	useEffect(() => {
		initializeApp();
	}, []);

	if (isLoading) {
		return (
			<View className="flex-1 bg-white dark:bg-patchwork-dark-100 items-center justify-center">
				<Image
					source={
						appIcon
							? { uri: appIcon }
							: require('../assets/images/PatchworkColorful.png')
					}
					style={
						appIcon
							? { width: 160, height: 160, borderRadius: 32 }
							: { width: 160, height: 160 }
					}
					resizeMode="contain"
				/>
				<View className="mt-8">
					<Wander
						size={48}
						color={colorScheme === 'dark' ? '#FFFFFF' : '#000000'}
					/>
				</View>
			</View>
		);
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SystemBars style={colorScheme === 'dark' ? 'light' : 'dark'} />
			<BottomSheetModalProvider>
				<View className="flex-1 bg-white dark:bg-patchwork-dark-100">
					<QueryClientProvider client={queryClient}>
						<KeyboardProvider>
							<MenuProvider>
								<ApplicationNavigator />
								<Toast config={toastConfig} />
							</MenuProvider>
						</KeyboardProvider>
					</QueryClientProvider>
				</View>
			</BottomSheetModalProvider>
		</GestureHandlerRootView>
	);
}

export default withStallion(App);
