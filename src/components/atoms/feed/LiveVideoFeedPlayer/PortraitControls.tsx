import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

interface PortraitControlsProps {
	isActive: boolean;
	isPaused: boolean;
	currentTime: number;
	duration: number;
	onPress: () => void;
	onSeek: (time: number) => void;
	children?: React.ReactNode;
}

export const PortraitControls: React.FC<PortraitControlsProps> = ({
	isActive,
	isPaused,
	currentTime,
	duration,
	onPress,
	onSeek,
	children,
}) => {
	const [isSeeking, setIsSeeking] = useState(false);
	const [sliderValue, setSliderValue] = useState(0);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (!isSeeking) {
			setSliderValue(currentTime);
		}
	}, [currentTime, isSeeking]);

	const resetTimer = () => {
		if (timerRef.current) clearTimeout(timerRef.current);
	};

	const onSlidingStart = () => {
		setIsSeeking(true);
		if (timerRef.current) clearTimeout(timerRef.current);
	};

	const onSlidingComplete = (value: number) => {
		onSeek(value);
		setIsSeeking(false);
		resetTimer();
	};

	return (
		<View
			className="absolute inset-0 w-full h-full justify-between z-10"
			pointerEvents="box-none"
		>
			<TouchableOpacity
				activeOpacity={1}
				onPress={onPress}
				className="absolute inset-0 w-full h-full justify-center items-center z-10"
			>
				{isPaused && isActive && (
					<View className="w-20 h-20 items-center justify-center bg-black/40 rounded-full">
						<FontAwesomeIcon
							icon={faPlay}
							size={50}
							color="rgba(255,255,255,0.7)"
						/>
					</View>
				)}
			</TouchableOpacity>

			{children}

			<View
				className="absolute bottom-[2] -left-[10] -right-[10] z-50"
				pointerEvents="box-none"
			>
				<Slider
					style={{ width: '100%', height: 0, marginTop: 20 }}
					minimumValue={0}
					maximumValue={duration}
					value={sliderValue}
					minimumTrackTintColor="#FFFFFF"
					maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
					thumbTintColor="#fff0"
					onSlidingStart={onSlidingStart}
					onSlidingComplete={onSlidingComplete}
				/>
			</View>
		</View>
	);
};
