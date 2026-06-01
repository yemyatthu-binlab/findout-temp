import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import { Button } from '@/components/atoms/common/Button/Button';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { GuestStackScreenProps } from '@/types/navigation';
import { PatchworkLogo } from '@/util/svg/icon.common';
import { Image, View } from 'react-native';
import { cn } from '@/util/helper/twutil';
import { isTablet } from '@/util/helper/isTablet';
import { Trans, useTranslation } from 'react-i18next';
import LanguageSelectorModal from '@/components/molecules/account/LanguageSelectorModal/LanguageSelectorModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AccountSwitchingModal from '@/components/organisms/switchingAccounts/AccountSwitchingModal/AccountSwitchingModal';
import { useColorScheme } from 'nativewind';
import {
	useAppConfigActions,
	useAppConfigStore,
} from '@/store/appConfig/appConfigStore';
import { useWhiteLabelImages } from '@/hooks/custom/useWhiteLabelImages';

const Welcome: React.FC<GuestStackScreenProps<'Welcome'>> = ({
	navigation,
}) => {
	const { colorScheme } = useColorScheme();
	const { t, i18n } = useTranslation();
	const { appIcon } = useWhiteLabelImages();
	const { top } = useSafeAreaInsets();
	const { clearAppConfig } = useAppConfigActions();
	const appName = useAppConfigStore(state => state.activeAppInfo?.appName);
	const lineHeightStyle = i18n.language === 'my' ? { lineHeight: 32 } : {};

	return (
		<SafeScreen className="pt-0">
			<View className="flex-1 justify-center mb-9">
				<View className="pt-10 px-6">
					<AccountSwitchingModal isWelcome />
				</View>
				<View className="h-[40%] items-center justify-end">
					<View className="items-center justify-center mt-10">
						{appIcon ? (
							<Image
								source={{ uri: appIcon }}
								className="w-[90px] h-[90px] rounded-2xl"
								resizeMode="cover"
							/>
						) : (
							<PatchworkLogo colorScheme={colorScheme} />
						)}
					</View>
					<ThemeText className="mt-4 text-2xl font-bold text-black dark:text-white">
						{appName || 'Patchwork'}
					</ThemeText>
				</View>
				<View className="flex-1 rounded-tr-[50] bg-white dark:bg-patchwork-dark-100 p-6 pb-10">
					<View className="flex-grow items-center mx-3">
						<Button
							variant="default"
							className={cn(
								'w-full h-12 mb-4 mt-6 bg-patchwork-primary dark:bg-white',
								isTablet ? 'w-[50%]' : 'w-full',
							)}
							onPress={() => navigation.navigate('SignUp')}
						>
							<ThemeText className="ml-2 text-white dark:text-black">
								{t('login.sign_up')}
							</ThemeText>
						</Button>
						<View className="flex flex-row items-center mt-3 justify-center">
							<ThemeText className="text-zinc-500 dark:text-zinc-200">
								{t('login.have_account')}
							</ThemeText>
							<Button
								variant="outline"
								size={'sm'}
								className="border-slate-400 ml-2 px-4"
								onPress={() => navigation.navigate('Login')}
							>
								<View className="flex-row justify-center items-center">
									<ThemeText
										size={'fs_13'}
										className="leading-5 text-black dark:text-white"
									>
										{t('login.sign_in')}
									</ThemeText>
								</View>
							</Button>
						</View>
					</View>
				</View>

				<View className="flex-1 justify-end mx-5">
					<ThemeText
						className="text-center text-zinc-500 dark:text-zinc-200"
						style={lineHeightStyle}
					>
						<Trans
							i18nKey="login.welcome_page_agreement"
							components={{
								terms: (
									<ThemeText
										key={'terms'}
										className="my-4 active:opacity-80"
										onPress={() => {
											navigation.navigate('WebViewer', {
												url: 'https://patchwork.io/terms-of-service',
												customTitle: 'Terms & Conditions',
											});
										}}
									/>
								),
								privacy: (
									<ThemeText
										key={'privacy'}
										className="my-4 active:opacity-80"
										onPress={() => {
											navigation.navigate('WebViewer', {
												url: 'https://patchwork.io/privacy-policy',
												customTitle: 'Privacy Policy',
											});
										}}
									/>
								),
							}}
						/>
					</ThemeText>
				</View>
			</View>
			<View style={{ paddingTop: top }} className="absolute right-4">
				{/* <LanguageSelectorModal />
				 */}
				<Button
					variant="default"
					size={'sm'}
					className="px-3 rounded-lg"
					onPress={clearAppConfig}
				>
					<ThemeText className="text-white">Stop Testing</ThemeText>
				</Button>
			</View>
		</SafeScreen>
	);
};

export default Welcome;
