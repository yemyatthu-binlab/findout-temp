import React, { useState, useEffect } from 'react';
import {
	View,
	Platform,
	KeyboardAvoidingView,
	ScrollView,
	StyleSheet,
	TextInput,
} from 'react-native';
import { useGetAppDetailsFromChannelQuery } from '@/hooks/queries/auth.queries';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import { Button } from '@/components/atoms/common/Button/Button';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { PatchworkLogo } from '@/util/svg/icon.common';
import { useColorScheme } from 'nativewind';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
	faQrcode,
	faTimes,
	faImage,
	faLink,
} from '@fortawesome/free-solid-svg-icons';
import { RootStackParamList } from '@/types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
	Camera,
	useCameraDevice,
	useCameraPermission,
	useObjectOutput,
	ScannedCode,
} from 'react-native-vision-camera';
import Toast from 'react-native-toast-message';
import ImagePicker from 'react-native-image-crop-picker';
import QRKit from 'react-native-qr-kit';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withRepeat,
	withTiming,
} from 'react-native-reanimated';
import { useAppConfigActions } from '@/store/appConfig/appConfigStore';
import { useRequestPermissionToInstanceMutation } from '@/hooks/mutations/auth.mutation';
import { useAuthStoreAction } from '@/store/auth/authStore';
import { downloadAndSaveWhiteLabelImages } from '@/util/helper/imageHelper';

const LOADING_STEPS = [
	'Fetching the API...',
	'Requesting Client id and secret...',
	'Syncing theme...',
	'Updating Layout...',
	'Initializing host URL...',
	'Preparing the app...',
];

type AppStartScannerProps = NativeStackScreenProps<
	RootStackParamList,
	'AppStartScanner'
>;

const AppStartScanner = ({ route, navigation }: AppStartScannerProps) => {
	const { colorScheme } = useColorScheme();
	const [isScanning, setIsScanning] = useState(false);
	const [showManualInput, setShowManualInput] = useState(false);
	const [manualUrl, setManualUrl] = useState('');
	const { hasPermission, requestPermission } = useCameraPermission();
	const device = useCameraDevice('back');

	const [scannedAppId, setScannedAppId] = useState<string>('');
	const [scannedUserId, setScannedUserId] = useState<string>('');
	const [scannedToken, setScannedToken] = useState<string>('');
	const [currentStepIndex, setCurrentStepIndex] = useState(0);

	// Reanimated shared values for floating and breathing effects
	const scale = useSharedValue(1);
	const translateY = useSharedValue(0);
	const rippleScale1 = useSharedValue(1);
	const rippleOpacity1 = useSharedValue(0.4);
	const rippleScale2 = useSharedValue(1);
	const rippleOpacity2 = useSharedValue(0);
	const rippleScale3 = useSharedValue(1);
	const rippleOpacity3 = useSharedValue(0);

	const {
		mutate: requestPermissionToInstance,
		isPending: isRequestingInstance,
	} = useRequestPermissionToInstanceMutation({
		onSuccess: data => {}, // required parameter, even if empty
	});

	const { data: channelAppDetails, isLoading: isFetchingAppDetails } =
		useGetAppDetailsFromChannelQuery({
			appId: scannedAppId,
			userId: scannedUserId,
			enabled: !!scannedAppId && !!scannedUserId,
		});

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isFetchingAppDetails || isRequestingInstance) {
			setCurrentStepIndex(0);
			interval = setInterval(() => {
				setCurrentStepIndex(prev => (prev + 1) % LOADING_STEPS.length);
			}, 1800);
		}
		return () => clearInterval(interval);
	}, [isFetchingAppDetails, isRequestingInstance]);

	useEffect(() => {
		scale.value = withRepeat(withTiming(1.09, { duration: 2200 }), -1, true);
		translateY.value = withRepeat(
			withTiming(-30, { duration: 2200 }),
			-1,
			true,
		);

		rippleScale1.value = 1;
		rippleOpacity1.value = 0.4;
		rippleScale1.value = withRepeat(
			withTiming(1.5, { duration: 2200 }),
			-1,
			false,
		);
		rippleOpacity1.value = withRepeat(
			withTiming(0, { duration: 2200 }),
			-1,
			false,
		);

		// Ripple effect 2 (staggered)
		const timeout1 = setTimeout(() => {
			rippleScale2.value = 1;
			rippleOpacity2.value = 0.4;
			rippleScale2.value = withRepeat(
				withTiming(1.5, { duration: 2200 }),
				-1,
				false,
			);
			rippleOpacity2.value = withRepeat(
				withTiming(0, { duration: 2200 }),
				-1,
				false,
			);
		}, 733);

		const timeout2 = setTimeout(() => {
			rippleScale3.value = 1;
			rippleOpacity3.value = 0.4;
			rippleScale3.value = withRepeat(
				withTiming(1.5, { duration: 2200 }),
				-1,
				false,
			);
			rippleOpacity3.value = withRepeat(
				withTiming(0, { duration: 2200 }),
				-1,
				false,
			);
		}, 1466);

		return () => {
			clearTimeout(timeout1);
			clearTimeout(timeout2);
		};
	}, [
		scale,
		translateY,
		rippleScale1,
		rippleOpacity1,
		rippleScale2,
		rippleOpacity2,
		rippleScale3,
		rippleOpacity3,
	]);

	const animatedCircleStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }, { translateY: translateY.value }],
	}));

	const rippleAnimatedStyle1 = useAnimatedStyle(() => ({
		transform: [{ scale: rippleScale1.value }],
		opacity: rippleOpacity1.value,
	}));

	const rippleAnimatedStyle2 = useAnimatedStyle(() => ({
		transform: [{ scale: rippleScale2.value }],
		opacity: rippleOpacity2.value,
	}));

	const rippleAnimatedStyle3 = useAnimatedStyle(() => ({
		transform: [{ scale: rippleScale3.value }],
		opacity: rippleOpacity3.value,
	}));

	const { setAppConfig } = useAppConfigActions();
	const { setUserOriginInstance } = useAuthStoreAction();

	useEffect(() => {
		if (channelAppDetails) {
			console.log('App details fetched successfully!', channelAppDetails);

			let targetDomain = '';
			const communitySetting = channelAppDetails?.data?.CommunitySetting?.[0];
			if (communitySetting) {
				const { hostingType, serverName } = communitySetting;
				if (hostingType === 'NEWSMAST_HOSTED') {
					targetDomain = `${serverName}.channel.org`;
				} else {
					targetDomain = serverName.replace(/^https?:\/\//, '');
				}
			}

			requestPermissionToInstance(
				{ domain: targetDomain },
				{
					onSuccess: resp => {
						Toast.show({
							type: 'successToast',
							text1: 'App details fetched successfully!',
						});
						setUserOriginInstance(targetDomain);
						setAppConfig(
							scannedToken,
							scannedAppId,
							scannedUserId,
							channelAppDetails,
							resp.client_id,
							resp.client_secret,
						);
						if (channelAppDetails?.data?.Branding) {
							downloadAndSaveWhiteLabelImages(channelAppDetails.data.Branding);
						}
						setScannedAppId('');
						setScannedUserId('');
						setScannedToken('');
					},
					onError: () => {
						Toast.show({
							type: 'errorToast',
							text1: 'Failed to fetch OAuth credentials for the app',
						});
						setScannedAppId('');
						setScannedUserId('');
						setScannedToken('');
					},
				},
			);
		}
	}, [channelAppDetails]);

	const extractQueryParams = (url: string) => {
		const queryPos = url.indexOf('?');
		if (queryPos === -1) return {};
		const queryStr = url.substring(queryPos + 1);
		const params: Record<string, string> = {};
		queryStr.split('&').forEach(part => {
			const [key, val] = part.split('=');
			if (key && val) {
				params[key] = decodeURIComponent(val);
			}
		});
		return params;
	};

	const processScannedUrl = (url: string) => {
		if (url.startsWith('patchwork://app?token')) {
			const params = extractQueryParams(url);
			if (params.appId && params.userId) {
				setScannedAppId(params.appId);
				setScannedUserId(params.userId);
				setScannedToken(params.token || '');
			} else {
				Toast.show({
					type: 'errorToast',
					text1: 'Missing appId or userId in URL',
				});
			}
		} else {
			Toast.show({
				type: 'errorToast',
				text1: 'Invalid URL',
			});
		}
	};

	const handleManualSubmit = () => {
		processScannedUrl(manualUrl.trim());
	};

	const handleUploadFromPhoto = async () => {
		try {
			const image = await ImagePicker.openPicker({
				mediaType: 'photo',
			});

			const response = await QRKit.decodeQR(image.path);

			if (response.success && response.data) {
				processScannedUrl(response.data);
			} else {
				Toast.show({
					type: 'errorToast',
					text1: 'No QR Code found',
				});
			}
		} catch (error) {
			console.log('Upload from photo blocked/failed', error);
		}
	};

	const handleScanPress = async () => {
		if (!hasPermission) {
			const result = await requestPermission();
			if (!result) {
				Toast.show({
					type: 'errorToast',
					text1: 'Camera permission denied',
				});
				return;
			}
		}
		setIsScanning(true);
	};

	const objectOutput = useObjectOutput({
		types: ['qr'],
		onObjectsScanned: objects => {
			if (!isScanning) return;
			const code = objects[0] as ScannedCode;
			const value = code?.value;
			if (!value) return;

			setIsScanning(false);
			processScannedUrl(value);
		},
	});

	return (
		<>
			{!isFetchingAppDetails && !isRequestingInstance && (
				<SafeScreen>
					<KeyboardAvoidingView
						behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
						className="flex-1"
					>
						<ScrollView
							contentContainerStyle={{ flexGrow: 1 }}
							keyboardShouldPersistTaps="handled"
						>
							<View className="flex-1 justify-center mb-9">
								<View className="h-[40%] items-start justify-start px-2">
									<View className="flex-row items-center justify-start">
										<PatchworkLogo
											colorScheme={colorScheme}
											showLabelText={false}
											width={90}
											height={90}
										/>
										<ThemeText className="text-2xl font-bold -ml-2 -mt-5">
											Patchwork
										</ThemeText>
									</View>
								</View>

								<View className="flex-1 bg-white dark:bg-patchwork-dark-100 p-6 pb-10">
									<View className="flex-grow mx-3 -mt-16">
										<Button
											variant="default"
											className="w-full h-14 mb-4 flex-row items-center justify-center bg-patchwork-primary dark:bg-white"
											onPress={handleScanPress}
										>
											<FontAwesomeIcon
												icon={faQrcode}
												color={'#fff'}
												size={20}
											/>
											<ThemeText className="ml-3 text-white dark:text-black font-semibold text-base">
												Scan QR Code
											</ThemeText>
										</Button>

										<Button
											variant="default"
											className="w-full h-14 mb-4 flex-row items-center justify-center bg-gray-200 dark:bg-patchwork-dark-200"
											onPress={handleUploadFromPhoto}
										>
											<FontAwesomeIcon
												icon={faImage}
												color={colorScheme === 'dark' ? '#fff' : '#000'}
												size={20}
											/>
											<ThemeText className="ml-3 text-black dark:text-white font-semibold text-base">
												Upload from Photo
											</ThemeText>
										</Button>

										<Button
											variant="default"
											className="w-full h-14 mb-4 flex-row items-center justify-center bg-gray-200 dark:bg-patchwork-dark-200"
											onPress={() => setShowManualInput(!showManualInput)}
										>
											<FontAwesomeIcon
												icon={faLink}
												color={colorScheme === 'dark' ? '#fff' : '#000'}
												size={20}
											/>
											<ThemeText className="ml-3 text-black dark:text-white font-semibold text-base">
												Enter URL manually
											</ThemeText>
										</Button>

										{showManualInput && (
											<View className="mt-2 bg-gray-50 dark:bg-patchwork-dark-200 p-4 rounded-xl border border-gray-100 dark:border-patchwork-dark-300">
												<TextInput
													placeholder="patchwork://app?token=..."
													placeholderTextColor={
														colorScheme === 'dark' ? '#9ca3af' : '#6b7280'
													}
													value={manualUrl}
													onChangeText={setManualUrl}
													className="h-12 bg-white dark:bg-patchwork-dark-100 px-4 rounded-lg text-black dark:text-white mb-3"
													autoCapitalize="none"
													autoCorrect={false}
												/>
												<Button
													variant="default"
													className="w-full h-12 flex-row items-center justify-center bg-patchwork-primary dark:bg-white"
													onPress={handleManualSubmit}
												>
													<ThemeText className="text-white dark:text-black font-semibold text-base">
														Submit
													</ThemeText>
												</Button>
											</View>
										)}
									</View>
								</View>
							</View>
						</ScrollView>
					</KeyboardAvoidingView>

					{/* Camera Scanning Overlay */}
					{isScanning && device != null && (
						<View style={StyleSheet.absoluteFill} className="z-50 bg-black">
							<Camera
								style={StyleSheet.absoluteFill}
								device={device!}
								isActive={isScanning}
								outputs={[objectOutput]}
							/>
							<View className="absolute top-12 right-6">
								<Button
									variant="outline"
									onPress={() => setIsScanning(false)}
									className="bg-black/50 w-12 h-12 flex items-center justify-center rounded-full"
								>
									<FontAwesomeIcon icon={faTimes} color="#fff" size={24} />
								</Button>
							</View>
						</View>
					)}

					{/* 

					{/* Dynamic Animated Loading Overlay */}
				</SafeScreen>
			)}
			{(isFetchingAppDetails || isRequestingInstance) && (
				<View
					style={StyleSheet.absoluteFill}
					className="z-50 items-center justify-center bg-white backdrop-blur-md"
				>
					<Animated.View style={[animatedCircleStyle]}>
						{/* Main White Outer Circle */}
						<View
							className="w-64 h-64 rounded-full items-center justify-center bg-white border border-slate-200/60 shadow-2xl"
							style={{
								shadowColor: '#0f172a',
								shadowOffset: { width: 0, height: 12 },
								shadowOpacity: 0.08,
								shadowRadius: 24,
								elevation: 8,
								zIndex: 30,
							}}
						>
							{/* Inner Rim Accent (Subtle Gradient) */}
							{/* <LinearGradient
								colors={['#ffffff', '#fefefe']} // Delicate cooler off-white accent
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 1 }}
								style={{
									position: 'absolute',
									top: 2,
									left: 2,
									right: 2,
									bottom: 2,
									borderRadius: 126,
									zIndex: 20,
								}}
							/> */}

							{/* Solid White Center to mask the gradient, leaving only the inner rim */}
							<View
								className="bg-white items-center justify-center z-30"
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									borderRadius: 300,
								}}
							>
								<ThemeText className="text-center px-6 text-sm font-semibold text-slate-600 tracking-wide leading-5">
									{LOADING_STEPS[currentStepIndex]}
								</ThemeText>
							</View>
							<Animated.View
								className="absolute w-64 h-64 rounded-full bg-slate-100 -z-20"
								style={[rippleAnimatedStyle1]}
							/>
							<Animated.View
								className="absolute w-64 h-64 rounded-full bg-slate-100 -z-20"
								style={[rippleAnimatedStyle2]}
							/>
							<Animated.View
								className="absolute w-64 h-64 rounded-full bg-slate-100 -z-20"
								style={[rippleAnimatedStyle3]}
							/>
						</View>
					</Animated.View>
				</View>
			)}
		</>
	);
};

export default AppStartScanner;
