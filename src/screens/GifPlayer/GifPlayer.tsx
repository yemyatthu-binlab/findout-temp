import React, { useState } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import BackButton from '@/components/atoms/common/BackButton/BackButton';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootScreenProps } from '@/types/navigation';
import { useColorScheme, styled } from 'nativewind';
import Video, { ResizeMode } from 'react-native-video';
import { CircleFade } from 'react-native-animated-spinkit';

const StyledVideo = styled(Video);

const GifPlayer: React.FC<RootScreenProps<'GifPlayer'>> = ({
	navigation,
	route,
}) => {
	const insets = useSafeAreaInsets();
	const { status, gifUrl } = route.params;
	const { colorScheme } = useColorScheme();
	const [isLoading, setIsLoading] = useState(true);

	const HeaderOverlay = () => (
		<LinearGradient
			colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.6)', 'transparent']}
			style={{
				position: 'absolute',
				bottom: 0,
				left: -10,
				right: 0,
				height: 150,
				zIndex: 100,
				paddingTop: 8,
			}}
		></LinearGradient>
	);

	return (
		<SafeScreen className="bg-black">
			<View
				className="absolute z-20 left-3 bg-[#0005] rounded-full"
				style={{ top: insets.top + 20 }}
			>
				<BackButton forceLight />
			</View>

			<View className="flex-1 justify-center bg-black items-center">
				<StyledVideo
					paused={false}
					controls={false}
					repeat
					resizeMode={ResizeMode.CONTAIN}
					source={{ uri: gifUrl }}
					className={`w-full h-full dark:bg-black overflow-hidden`}
					onLoad={() => {
						setIsLoading(false);
					}}
					onBuffer={({ isBuffering }) => setIsLoading(isBuffering)}
				/>
				<HeaderOverlay />
				{isLoading && (
					<View className="absolute inset-0 justify-center items-center">
						{Platform.OS == 'android' ? (
							<CircleFade
								size={25}
								color={colorScheme === 'dark' ? '#fff' : '#000'}
							/>
						) : (
							<ActivityIndicator size="large" color="#FFFFFF" />
						)}
					</View>
				)}
			</View>
		</SafeScreen>
	);
};

export default GifPlayer;
