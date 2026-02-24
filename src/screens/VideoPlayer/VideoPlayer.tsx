import {
	View,
	Dimensions,
	Platform,
	Pressable,
	ActivityIndicator,
} from 'react-native';
import React, {
	useState,
	useRef,
	useMemo,
	useCallback,
	useEffect,
} from 'react';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import BackButton from '@/components/atoms/common/BackButton/BackButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootScreenProps } from '@/types/navigation';
import Video, { ResizeMode, VideoRef } from 'react-native-video';
import Slider from '@react-native-community/slider';
import {
	ForwardFifteenIcon,
	PauseIcon,
	PlayIcon,
	RewindFifteenIcon,
} from '@/util/svg/icon.common';
import { useFocusEffect } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import LinearGradient from 'react-native-linear-gradient';
import { CircleFade } from 'react-native-animated-spinkit';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const VideoPlayer: React.FC<RootScreenProps<'VideoPlayer'>> = ({
	navigation,
	route,
}) => {
	const insets = useSafeAreaInsets();
	const { status } = route.params;
	const videoRef = useRef<VideoRef>(null);
	const [paused, setPaused] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [currentTime, setCurrentTime] = useState(0);
	const { colorScheme } = useColorScheme();
	const [showControls, setShowControls] = useState(true);
	const [isSliding, setIsSliding] = useState(false);

	useFocusEffect(
		useCallback(() => {
			return () => {
				videoRef.current?.pause();
				setPaused(true);
			};
		}, []),
	);

	useEffect(() => {
		if (showControls) {
			const timeout = setTimeout(() => setShowControls(false), 3000);
			return () => clearTimeout(timeout);
		}
	}, [showControls]);

	const { videoDimensions, duration } = useMemo(() => {
		const { width, height, duration } =
			status.media_attachments[0].meta?.original!;
		const aspectRatio = width / height;

		let calculatedWidth = screenWidth;
		let calculatedHeight = screenWidth / aspectRatio;

		if (height > width && calculatedHeight > screenHeight) {
			calculatedHeight = screenHeight;
			calculatedWidth = screenHeight * aspectRatio;
		}

		if (height < width && calculatedHeight > screenHeight) {
			calculatedHeight = screenHeight;
			calculatedWidth = screenHeight * aspectRatio;
		}

		return {
			videoDimensions: {
				width: calculatedWidth,
				height: calculatedHeight,
			},
			duration,
		};
	}, [status]);

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

	const TimeIndicator = () => (
		<View className="absolute bottom-7 self-center bg-[#000000aa] px-3 py-1 rounded-full">
			<ThemeText className="text-white text-xs">
				{formatTime(currentTime)} / {formatTime(duration)}
			</ThemeText>
		</View>
	);

	const handleSeek = (seconds: number) => {
		const newTime = Math.max(0, Math.min(currentTime + seconds, duration));
		videoRef.current?.seek(newTime);
		setCurrentTime(newTime);
		setShowControls(true);
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	return (
		<SafeScreen className="bg-black">
			<View
				className="absolute z-50 left-3 bg-[#0005] rounded-full"
				style={{ top: insets.top + 20 }}
			>
				<BackButton forceLight />
			</View>
			<View className="flex-1 justify-center bg-black">
				<View className="flex-1 justify-center items-center z-40 ">
					<Pressable
						className="absolute inset-0 z-10 top-0 bottom-0 left-0 right-0"
						onPress={() => {
							setShowControls(!showControls);
						}}
					/>
					<Video
						ref={videoRef}
						source={{ uri: status.media_attachments[0].url }}
						style={videoDimensions}
						resizeMode={ResizeMode.COVER}
						paused={paused}
						onLoad={() => {
							setIsLoading(false);
						}}
						onBuffer={({ isBuffering }) => setIsLoading(isBuffering)}
						onProgress={({ currentTime }) => setCurrentTime(currentTime)}
						repeat={true}
						controls={false}
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
					{showControls && !isLoading && (
						<View
							className="absolute inset-0 justify-center flex-row items-center"
							style={{ zIndex: 999 }}
						>
							<Pressable
								className="bg-[#0004] rounded-full p-3 active:opacity-80"
								onPress={() => handleSeek(-15)}
							>
								<RewindFifteenIcon />
							</Pressable>
							<Pressable
								className=" bg-[#0004] mx-12 rounded-full p-3"
								onPress={() => setPaused(!paused)}
							>
								{paused ? (
									<PlayIcon width={35} height={35} fill="#fff" />
								) : (
									<PauseIcon width={35} height={35} fill="#fff" />
								)}
							</Pressable>

							<Pressable
								className="bg-[#0004] rounded-full p-3 active:opacity-80"
								onPress={() => handleSeek(15)}
							>
								<ForwardFifteenIcon />
							</Pressable>
						</View>
					)}
				</View>

				<View className="absolute bottom-5 w-full">
					<View className="flex-row items-center justify-between">
						{true && <TimeIndicator />}

						<Slider
							className="flex-1"
							style={{
								flex: 1,
								height: 40,
								opacity: currentTime === 0 ? 0.5 : 1,
								zIndex: 999,
							}}
							minimumValue={0}
							maximumValue={duration || 1}
							value={currentTime}
							onSlidingStart={() => setIsSliding(true)}
							onSlidingComplete={value => {
								videoRef.current?.seek(value);
								setIsSliding(false);
							}}
							minimumTrackTintColor="#FFFFFF"
							maximumTrackTintColor="rgba(255,255,255,0.5)"
							thumbTintColor="#fff0"
						/>
					</View>
				</View>
			</View>
		</SafeScreen>
	);
};

export default VideoPlayer;
