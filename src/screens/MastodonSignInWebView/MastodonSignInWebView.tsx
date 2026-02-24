import BackButton from '@/components/atoms/common/BackButton/BackButton';
import Header from '@/components/atoms/common/Header/Header';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import { useAuthorizeInstanceMutation } from '@/hooks/mutations/auth.mutation';
import { verifyAuthToken } from '@/services/auth.service';
import { useAuthStoreAction } from '@/store/auth/authStore';
import { GuestStackScreenProps } from '@/types/navigation';
import { ensureHttp } from '@/util/helper/helper';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import type { WebViewNavigation } from 'react-native-webview';
import { WebView } from 'react-native-webview';
import * as Progress from 'react-native-progress';
import CustomAlert from '@/components/atoms/common/CustomAlert/CustomAlert';
import { initialAlertState } from '@/util/constant/common';
import { Button } from '@/components/atoms/common/Button/Button';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { useColorScheme } from 'nativewind';
import customColor from '@/util/constant/color';
import { useTranslation } from 'react-i18next';
import { getUserLocale } from '@/services/profile.service';
import { ILanguage, useLanguageStore } from '@/store/feed/languageStore';
import {
	addOrUpdateAccount,
	AuthState,
	getAccountId,
	switchActiveAccount,
} from '@/util/storage';

const MastodonSignInWebView = ({
	route,
	navigation,
}: GuestStackScreenProps<'MastodonSignInWebView'>) => {
	const { t } = useTranslation();
	const { setLanguage } = useLanguageStore();
	const { colorScheme } = useColorScheme();
	const { url, domain, client_id, client_secret } = route.params;
	const [progress, setProgress] = useState(0);
	const [isLoaded, setLoaded] = useState(false);
	const { setUserInfo, setUserOriginInstance, setAuthState } =
		useAuthStoreAction();
	const [alertState, setAlert] = useState(initialAlertState);

	const { mutate } = useAuthorizeInstanceMutation({
		onSuccess: async resp => {
			// await saveAuthState(
			// 	'AUTH_STATE',
			// 	JSON.stringify({
			// 		access_token: resp.access_token,
			// 		domain: ensureHttp(domain),
			// 	}),
			// );
			const userPrefs = await getUserLocale();
			if (userPrefs?.['posting:default:language']) {
				setLanguage(userPrefs['posting:default:language'] as ILanguage);
			}

			const userInfo = await verifyAuthToken(
				resp.access_token,
				ensureHttp(domain),
			);

			const newAuthState: AuthState = {
				access_token: resp.access_token,
				domain: ensureHttp(domain),
				userInfo: {
					username: userInfo.username,
					displayName: userInfo.display_name,
					avatar: userInfo.avatar,
				},
			};

			await addOrUpdateAccount(newAuthState);
			const accId = getAccountId(newAuthState);
			await switchActiveAccount(accId);

			setUserInfo(userInfo);
			setUserOriginInstance(domain);
			setAuthState({
				wordpress: { token: '' },
				mastodon: { token: resp.access_token },
			});
			// setAuthToken(resp.access_token);
		},
		onError: async error => {
			setAlert({
				message: error?.message || 'Something went wrong.',
				isErrorAlert: true,
				isOpen: true,
			});
		},
	});

	const onNavigationStateChange = (navigationState: WebViewNavigation) => {
		const authorizationCode = navigationState.url.match(/[?&]code=([^&]+)/);

		if (authorizationCode && authorizationCode[1]) {
			mutate({
				code: authorizationCode[1],
				domain,
				client_id,
				client_secret,
				redirect_uri: 'patchwork://',
				grant_type: 'authorization_code',
			});
		}
	};

	const clearCookies = async () => {
		// try {
		// 	await Cookie.clearAll();
		// 	Toast.show({
		// 		type: 'success',
		// 		text1: t('toast.clear_cookie'),
		// 		position: 'top',
		// 		topOffset: 50,
		// 		visibilityTime: 2000,
		// 		onHide: () => navigation.push('ServerInstance'),
		// 	});
		// } catch (error) {
		// 	Toast.show({
		// 		type: 'error',
		// 		text1: t('toast.cookie_clear_failed'),
		// 		position: 'top',
		// 		topOffset: 50,
		// 	});
		// }
	};

	return (
		<SafeScreen>
			<Header
				title={''}
				leftCustomComponent={<BackButton extraClass="border-0" />}
				rightCustomComponent={
					<Button variant={'outline'} size={'sm'} onPress={clearCookies}>
						<ThemeText size={'fs_13'}>{t('login.clear_cookies')}</ThemeText>
					</Button>
				}
				hideUnderline
			/>
			{!isLoaded && (
				<Progress.Bar
					progress={progress}
					width={null}
					borderWidth={0}
					borderRadius={0}
					height={3}
					color={
						colorScheme === 'dark'
							? customColor['patchwork-primary-dark']
							: customColor['patchwork-primary']
					}
				/>
			)}
			<KeyboardAvoidingView
				style={{ flex: 1, marginTop: !isLoaded ? 0 : 3 }}
				behavior="padding"
				keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
			>
				<WebView
					source={{ uri: url }}
					onLoadProgress={({ nativeEvent }) =>
						setProgress(nativeEvent.progress)
					}
					onLoadEnd={() => setLoaded(true)}
					onNavigationStateChange={onNavigationStateChange}
					overScrollMode="never"
					showsVerticalScrollIndicator={false}
					nestedScrollEnabled={true}
				/>
				<CustomAlert
					isVisible={alertState.isOpen}
					extraTitleStyle="text-white text-center -ml-2"
					extraOkBtnStyle={colorScheme == 'dark' ? 'text-white' : 'text-black'}
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
					type={alertState.isErrorAlert ? 'error' : 'success'}
				/>
			</KeyboardAvoidingView>
		</SafeScreen>
	);
};

export default MastodonSignInWebView;
