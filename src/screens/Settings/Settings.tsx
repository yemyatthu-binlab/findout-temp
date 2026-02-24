import { queryClient } from '@/App';
import BackButton from '@/components/atoms/common/BackButton/BackButton';
import CustomAlert from '@/components/atoms/common/CustomAlert/CustomAlert';
import Header from '@/components/atoms/common/Header/Header';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import AccountSwitchingModal from '@/components/organisms/switchingAccounts/AccountSwitchingModal/AccountSwitchingModal';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import { useAccounts } from '@/hooks/custom/useAccounts';
import useAuthRevalidationOnAppReturn from '@/hooks/custom/useAuthRevalidationOnAppReturn';
import {
	useChangeEmailNotiSetting,
	useMutePushNotification,
	usePushNotiRevokeTokenMutation,
} from '@/hooks/mutations/pushNoti.mutation';
import { useShowMastodonInstance } from '@/hooks/queries/auth.queries';
import {
	useCheckEmailNotiSetting,
	useGetAltTextSetting,
	useGetNotificationMuteStatus,
} from '@/hooks/queries/feed.queries';
import { useAuthStore, useAuthStoreAction } from '@/store/auth/authStore';
import { useCreateAudienceStore } from '@/store/compose/audienceStore/createAudienceStore';
import { useActiveDomainStore } from '@/store/feed/activeDomain';
import { ILanguage } from '@/store/feed/languageStore';
import { usePushNoticationStore } from '@/store/pushNoti/pushNotiStore';
import { SettingStackScreenProps } from '@/types/navigation';
import {
	updateAltTextSettingCache,
	updateEmailNotiSetting,
	updateNotiMuteUnMuteCache,
} from '@/util/cache/channel/channelCache';
import { CHANNEL_INSTANCE, DEFAULT_INSTANCE } from '@/util/constant';
import { handleError } from '@/util/helper/helper';
import { cn } from '@/util/helper/twutil';
import { AppIcons } from '@/util/icons/icon.common';
import { Logout } from '@/util/svg/icon.common';
import {
	Pressable,
	View,
	ScrollView,
	Linking,
	Platform,
	UIManager,
} from 'react-native';
import VersionInfo from 'react-native-version-info';

import { useFocusEffect } from '@react-navigation/native';
import { SettingToggleItem } from '@/components/molecules/settings/SettingToggleItem/SettingToggleItem';
import { SettingLink } from '@/components/molecules/settings/SettingLink/SettingLink';
import { SettingSection } from '@/components/molecules/settings/SettingSection/SettingSection';
import { SettingTCLinkKeys } from '@/util/constant/setting';
import { useUpdateAltTextSetting } from '@/hooks/mutations/feed.mutation';
import {
	addOrUpdateAccount,
	AuthState,
	removeAccount,
	switchActiveAccount,
} from '@/util/storage';
import i18n from '@/i18n';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';
import { useCallback, useState } from 'react';
import { AccordionContent } from '@/components/molecules/settings/AccordionContent/AccordionContent';
const ENABLED_INSTANCES = [DEFAULT_INSTANCE, CHANNEL_INSTANCE];

if (Platform.OS === 'android') {
	UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const Settings: React.FC<SettingStackScreenProps<'Settings'>> = ({
	navigation,
}) => {
	const { t } = useTranslation();
	const { colorScheme } = useColorScheme();
	const [alertState, setAlert] = useState({
		message: '',
		isOpen: false,
		alertType: 'logout',
	});

	const [openSections, setOpenSections] = useState<string[]>([]);

	const toggleSection = (key: string) => {
		setOpenSections(prev =>
			prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key],
		);
	};

	const { mutateAsync } = usePushNotiRevokeTokenMutation({});
	const { clearAuthState } = useAuthStoreAction();
	const fcmToken = usePushNoticationStore(state => state.fcmToken);
	const { mastodon, userOriginInstance, userInfo, userTheme } = useAuthStore();
	const { actions, domain_name } = useActiveDomainStore();
	const { clearAudience } = useCreateAudienceStore();
	const { fetchAccounts, activeAccId } = useAccounts();
	const isEnabledInstance = ENABLED_INSTANCES.includes(userOriginInstance);

	const { data: notiMuteStatus } =
		useGetNotificationMuteStatus(isEnabledInstance);
	const { data: showMastodonBtn, refetch } = useShowMastodonInstance();

	const { data: emailNotiSetting } = useCheckEmailNotiSetting({
		options: { enabled: isEnabledInstance },
	});

	const { data: altTextSetting } = useGetAltTextSetting(
		DEFAULT_INSTANCE === userOriginInstance,
	);

	const { mutate: mutatePushNotification } = useMutePushNotification({
		onMutate: ({ mute }) => updateNotiMuteUnMuteCache(mute),
	});

	const { mutate: changeEmailNotiSetting } = useChangeEmailNotiSetting({
		onMutate: ({ allowed }) => updateEmailNotiSetting(allowed),
	});

	const { mutate: updateAltTextSetting } = useUpdateAltTextSetting({
		onMutate: ({ enabled }) => {
			updateAltTextSettingCache(enabled);
		},
	});

	const [newsletterEnabled, setNewsletterEnabled] = useState(true);

	useAuthRevalidationOnAppReturn(
		useCallback(() => {
			clearAuthState();
			queryClient.clear();
			clearAudience();
		}, [clearAuthState, clearAudience]),
	);

	useFocusEffect(
		useCallback(() => {
			if (domain_name !== userOriginInstance) {
				actions.setDomain(process.env.API_URL!);
			}
		}, [domain_name, userOriginInstance, actions]),
	);

	const handleOpenAdvancedSettings = () => {
		Linking.openURL(`${DEFAULT_INSTANCE}/settings/profile`).catch(err =>
			console.error('Failed to open URL:', err),
		);
	};

	const handleDeleteAccount = () => {
		setAlert({
			isOpen: true,
			message: t('setting.delete_confirmation'),
			alertType: 'delete-account',
		});
	};

	const handleOpenPolicy = (pathUrl: string, customTitle: string) => {
		navigation.navigate('WebViewer', {
			url: pathUrl,
			customTitle,
		});
	};

	const renderAccountSettings = isEnabledInstance && (
		<View className="-mt-1">
			<SettingLink
				text={t('screen.my_information')}
				onPress={() => navigation.navigate('MyInformation')}
			/>
			<SettingLink
				text={t('setting.change_password')}
				onPress={() => navigation.navigate('UpdatePassword')}
			/>
		</View>
	);

	const renderNotificationSettings = (
		<View className="-mt-1">
			{isEnabledInstance && (
				<SettingToggleItem
					text={t('setting.receive_push_notification')}
					isEnabled={!notiMuteStatus?.mute}
					onToggle={value => mutatePushNotification({ mute: !value })}
					isLoading={!notiMuteStatus}
				/>
			)}
			{isEnabledInstance && (
				<SettingToggleItem
					text={t('setting.receive_email_notification')}
					isEnabled={emailNotiSetting?.data}
					onToggle={value => changeEmailNotiSetting({ allowed: value })}
					isLoading={!emailNotiSetting}
				/>
			)}
		</View>
	);

	const renderAccountManagement = [DEFAULT_INSTANCE].includes(
		userOriginInstance,
	) && (
		<View className="mt-1">
			<AccountSwitchingModal />
			<SettingLink
				text={t('setting.advanced_settings')}
				onPress={handleOpenAdvancedSettings}
			/>
			<View className="mt-1.5">
				<SettingLink
					text={t('setting.delete_account')}
					onPress={handleDeleteAccount}
				/>
			</View>
		</View>
	);

	const renderFeedSettings = (
		<View className="-mt-1">
			<SettingLink
				text={t('screen.bookmarks')}
				onPress={() => navigation.navigate('BookmarkList')}
			/>
			<SettingLink
				text={t('screen.lists')}
				onPress={() => navigation.navigate('ListsStack', { screen: 'Lists' })}
			/>
			<SettingLink
				text={t('screen.scheduled_posts')}
				onPress={() => {
					navigation.navigate('ScheduledPostList');
				}}
			/>
			<SettingLink
				text={t('setting.timeline', 'Timeline')}
				onPress={() => {
					navigation.navigate('Timeline');
				}}
			/>
		</View>
	);

	const handleClearAuthonLogout = async () => {
		if (activeAccId) {
			await removeAccount(activeAccId);
		}
		await switchActiveAccount(null);
		fetchAccounts();
		clearAuthState();
		queryClient.clear();
		clearAudience();
	};

	const handleClearAuth = async () => {
		clearAuthState();
		queryClient.clear();
		clearAudience();
	};

	const handleLogout = async () => {
		setAlert(prev => ({ ...prev, isOpen: false }));
		try {
			if (fcmToken) {
				await mutateAsync({
					notification_token: fcmToken,
				});
			}
			// noted: update the current user theme and language before logout
			if (userInfo && mastodon.token) {
				const updatedAuthState: AuthState = {
					access_token: mastodon.token,
					domain: userOriginInstance,
					userInfo: {
						username: userInfo.username,
						displayName: userInfo.display_name,
						avatar: userInfo.avatar,
					},
					theme: userTheme,
					locale: i18n.language as ILanguage,
				};
				await addOrUpdateAccount(updatedAuthState);
			}
		} catch (error) {
			handleError(error);
		} finally {
			if (mastodon.token) {
				await handleClearAuthonLogout();
				// await mutateRevokeToken({
				//  token: access_token,
				// });
			}
		}
	};

	useAuthRevalidationOnAppReturn(handleClearAuth);

	return (
		<SafeScreen>
			<Header
				title={t('screen.profile_setting')}
				leftCustomComponent={<BackButton />}
			/>
			<ScrollView
				contentContainerStyle={{ flexGrow: 1, marginVertical: 10 }}
				showsVerticalScrollIndicator={false}
			>
				<View className="flex-1 mx-4">
					{/* Profile Settings */}
					<SettingSection
						title={t('setting.account_settings')}
						icon={AppIcons.profileSettings}
						colorScheme={colorScheme}
						sectionKey="account"
						isOpen={openSections.includes('account')}
						onToggle={toggleSection}
						mt="0"
					/>
					<AccordionContent isOpen={openSections.includes('account')}>
						{renderAccountSettings}
					</AccordionContent>

					{/* Notification Settings */}
					<SettingSection
						title={t('setting.notification_settings', 'Notification settings')}
						icon={AppIcons.notiSolid}
						colorScheme={colorScheme}
						sectionKey="notifications"
						isOpen={openSections.includes('notifications')}
						onToggle={toggleSection}
					/>
					<AccordionContent isOpen={openSections.includes('notifications')}>
						{renderNotificationSettings}
					</AccordionContent>
					{/* Feed setting */}
					<SettingSection
						title={t('setting.timeline_feed', 'Timeline & Feed')}
						icon={AppIcons.timeline}
						colorScheme={colorScheme}
						sectionKey="feed"
						isOpen={openSections.includes('feed')}
						onToggle={toggleSection}
					/>
					<AccordionContent isOpen={openSections.includes('feed')}>
						{renderFeedSettings}
					</AccordionContent>

					{/* Privacy & Safety Settings */}
					<SettingSection
						title={t('setting.privacy_safety', 'Privacy & safety')}
						icon={AppIcons.privacy}
						colorScheme={colorScheme}
						sectionKey="privacy"
						isOpen={openSections.includes('privacy')}
						onToggle={toggleSection}
					/>
					<AccordionContent isOpen={openSections.includes('privacy')}>
						<View className="-mt-1">
							<SettingLink
								text={t('setting.mute_and_block')}
								onPress={() => navigation.navigate('MuteAndBlockList')}
							/>
						</View>
					</AccordionContent>

					{/* Personalization Settings */}
					<SettingSection
						title={t('setting.personalization', 'Personalization')}
						icon={AppIcons.personalization}
						colorScheme={colorScheme}
						sectionKey="personalization"
						isOpen={openSections.includes('personalization')}
						onToggle={toggleSection}
					/>
					<AccordionContent isOpen={openSections.includes('personalization')}>
						<View className="-mt-1">
							<SettingLink
								text={t('setting.appearance_title')}
								onPress={() => navigation.navigate('Appearance')}
							/>
							<SettingLink
								text={t('setting.appearance.language')}
								onPress={() => navigation.navigate('Language')}
							/>
							{[DEFAULT_INSTANCE].includes(userOriginInstance) && (
								<View className="mt-1.5">
									<SettingToggleItem
										text={t('setting.enable_alt_text')}
										isEnabled={altTextSetting?.data}
										onToggle={value => updateAltTextSetting({ enabled: value })}
										isLoading={!altTextSetting}
									/>
								</View>
							)}
						</View>
					</AccordionContent>

					{/* Account Management Settings */}
					<SettingSection
						title={t('setting.account_management', 'Account management')}
						icon={AppIcons.accountManagement}
						iconSize={22}
						colorScheme={colorScheme}
						sectionKey="management"
						isOpen={openSections.includes('management')}
						onToggle={toggleSection}
					/>
					<AccordionContent isOpen={openSections.includes('management')}>
						{renderAccountManagement}
					</AccordionContent>
				</View>

				<View className="justify-center items-center mt-10 mb-8 mx-8 bottom-0">
					<View className={cn('flex-row flex-wrap justify-center my-4')}>
						{SettingTCLinkKeys.map((item, index, arr) => (
							<ThemeText
								key={index}
								className={cn(
									'my-1 active:opacity-80 text-patchwork-primary dark:text-white',
									index < arr.length - 1 && 'mr-1',
								)}
								size={'xs_12'}
								numberOfLines={1}
								ellipsizeMode="tail"
								onPress={() => handleOpenPolicy(item.path, t(item.titleKey))}
							>
								{t(item.textKey)}
								{index < arr.length - 1 && ','}{' '}
							</ThemeText>
						))}
					</View>

					<ThemeText className="mb-4" size={'xs_12'}>
						v.
						{VersionInfo.appVersion || '1.0.0'}
					</ThemeText>

					<Pressable
						onPress={() => {
							setAlert({
								isOpen: true,
								message: t('setting.logout_confirmation'),
								alertType: 'logout',
							});
							refetch();
						}}
						className="flex-row w- border w-full md:w-[300] border-gray-500 rounded-md py-4 justify-center items-center active:opacity-80"
					>
						<Logout
							width={25}
							height={25}
							className="mr-3"
							{...{ colorScheme }}
						/>
						<ThemeText className="text-center">
							{t('setting.log_out')}
						</ThemeText>
					</Pressable>
				</View>
			</ScrollView>
			<CustomAlert
				isVisible={alertState.isOpen}
				message={alertState.message}
				hasCancel
				handleCancel={() => {
					setAlert(prev => ({ ...prev, isOpen: false }));
				}}
				confirmBtnText={t('common.confirm')}
				handleOk={
					alertState.alertType == 'logout'
						? handleLogout
						: () => {
								Linking.openURL(`${DEFAULT_INSTANCE}/settings/delete`).catch(
									err => console.error('Failed to open URL:', err),
								);
								setAlert(prev => ({ ...prev, isOpen: false }));
						  }
				}
				extraOkBtnStyle="text-patchwork-red-50"
				type="error"
			/>
		</SafeScreen>
	);
};

export default Settings;
