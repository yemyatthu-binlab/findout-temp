import React, { useEffect, useState, useRef } from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Text,
	Pressable,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
	faPlay,
	faPause,
	faRotateLeft,
	faRotateRight,
	faHeadphones,
	faClosedCaptioning,
	faExpand,
	faVolumeHigh,
	faVolumeMute,
} from '@fortawesome/free-solid-svg-icons';

interface LandscapeControlsProps {
	isPaused: boolean;
	currentTime: number;
	duration: number;
	onTogglePlay: () => void;
	onSeek: (time: number) => void;
	onSkip: (seconds: number) => void;
	onEnterFullscreen: () => void;
	onToggleSubtitles: () => void;
	onToggleMute: () => void;
	areSubtitlesEnabled: boolean;
	isMuted: boolean;
	isLoading?: boolean;
}

const formatTime = (seconds: number) => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const LandscapeControls: React.FC<LandscapeControlsProps> = ({
	isPaused,
	currentTime,
	duration,
	onTogglePlay,
	onSeek,
	onSkip,
	onEnterFullscreen,
	onToggleSubtitles,
	onToggleMute,
	areSubtitlesEnabled,
	isMuted,
	isLoading = false,
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const isSeeking = useRef(false);
	const [sliderValue, setSliderValue] = useState(0);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (!isSeeking.current) {
			setSliderValue(currentTime);
		}
	}, [currentTime]);

	const resetTimer = () => {
		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => {
			if (!isPaused && !isSeeking.current) {
				setIsVisible(false);
			}
		}, 3000);
	};

	const handlePressScreen = () => {
		setIsVisible(prev => !prev);
		if (!isVisible) resetTimer();
	};

	const handleAction = (action: () => void) => {
		resetTimer();
		action();
	};

	const onSlidingStart = () => {
		isSeeking.current = true;
		if (timerRef.current) clearTimeout(timerRef.current);
	};

	const onSlidingComplete = (value: number) => {
		onSeek(value);
		isSeeking.current = false;
		resetTimer();
	};

	if (!isVisible) {
		return (
			<TouchableOpacity
				className="absolute top-0 left-0 w-full h-full z-10"
				onPress={handlePressScreen}
				activeOpacity={1}
			/>
		);
	}

	return (
		<TouchableOpacity
			className="absolute top-0 left-0 bottom-0 w-full h-full bg-black/40 z-10"
			activeOpacity={1}
			onPress={handlePressScreen}
		>
			<View className="flex-1 justify-between p-5">
				{/* Top Right */}
				<View className="flex-row justify-end items-center mt-2.5">
					{/* <TouchableOpacity className="ml-5 p-1">
						<FontAwesomeIcon icon={faHeadphones} size={20} color="white" />
					</TouchableOpacity> */}

					<TouchableOpacity
						className="ml-5 p-1"
						onPress={() => handleAction(onToggleSubtitles)}
					>
						<FontAwesomeIcon
							icon={faClosedCaptioning}
							size={20}
							color={areSubtitlesEnabled ? 'white' : 'rgba(255, 255, 255, 0.4)'}
						/>
					</TouchableOpacity>
				</View>

				<View className="flex-row justify-center items-center">
					<Pressable
						onPress={() => handleAction(() => onSkip(-15))}
						className="p-2.5 mx-5 active:opacity-80 active:scale-95 active:-rotate-12"
					>
						<FontAwesomeIcon icon={faRotateLeft} size={22} color="white" />
					</Pressable>

					<Pressable
						onPress={() => handleAction(onTogglePlay)}
						className={`w-[70px] h-[70px] justify-center items-center  rounded-full mx-5 active:opacity-80 ${
							isLoading ? 'bg-black/0' : 'bg-black/40'
						}`}
						disabled={isLoading}
					>
						{!isLoading && (
							<FontAwesomeIcon
								icon={isPaused ? faPlay : faPause}
								size={36}
								color="white"
							/>
						)}
					</Pressable>

					<Pressable
						onPress={() => handleAction(() => onSkip(15))}
						className="p-2.5 mx-5 active:opacity-80 active:scale-95 active:rotate-12"
					>
						<FontAwesomeIcon icon={faRotateRight} size={22} color="white" />
					</Pressable>
				</View>

				<View className="flex-row items-center justify-between -mb-5">
					<View className="flex-1 mr-2.5">
						<Slider
							className="w-full h-10"
							minimumValue={0}
							maximumValue={duration}
							value={sliderValue}
							onValueChange={val => {
								setSliderValue(val);
								resetTimer();
							}}
							onSlidingStart={onSlidingStart}
							onSlidingComplete={onSlidingComplete}
							minimumTrackTintColor="#FFFFFF"
							maximumTrackTintColor="rgba(255,255,255,0.3)"
							thumbTintColor="#fff0"
						/>
					</View>
					<Text className="text-white text-sm font-semibold mr-4 tabular-nums">
						{formatTime(sliderValue)}
					</Text>
					<Pressable
						className="p-1 active:opacity-80 active:scale-80"
						onPress={() => handleAction(onEnterFullscreen)}
					>
						<FontAwesomeIcon icon={faExpand} size={20} color="white" />
					</Pressable>

					{/* <Pressable
						className="p-1 active:opacity-80 active:scale-80"
						onPress={() => handleAction(onToggleMute)}
					>
						<FontAwesomeIcon
							icon={isMuted ? faVolumeMute : faVolumeHigh}
							size={20}
							color="white"
						/>
					</Pressable> */}
				</View>
			</View>
		</TouchableOpacity>
	);
};
