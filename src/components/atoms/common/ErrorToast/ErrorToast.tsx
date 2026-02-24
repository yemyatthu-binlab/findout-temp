import React, { useEffect } from 'react';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withRepeat,
	withTiming,
	Easing,
} from 'react-native-reanimated';
import { ThemeText } from '../ThemeText/ThemeText';
import { CrossMarkIcon } from '@/util/svg/icon.common';
import { View } from 'react-native';

const ErrorToast = ({ text1 }: { text1: string }) => {
	const rippleOpacity = useSharedValue(1);
	const rippleScale = useSharedValue(1);

	useEffect(() => {
		rippleOpacity.value = withRepeat(
			withTiming(0, {
				duration: 700,
				easing: Easing.out(Easing.ease),
			}),
			-1,
			false,
		);

		rippleScale.value = withRepeat(
			withTiming(2, {
				duration: 700,
				easing: Easing.out(Easing.ease),
			}),
			-1,
			false,
		);
	}, []);

	const rippleStyle = useAnimatedStyle(() => ({
		opacity: rippleOpacity.value,
		transform: [{ scale: rippleScale.value }],
	}));

	return (
		<View className="mt-4 bg-white border-l-2 border-l-red-500 items-center rounded-tr-md rounded-br-md shadow-md py-4 px-3 mx-1 flex-row flex-1 w-11/12">
			<View className="rounded-full mr-2 bg-red-500 p-1">
				<Animated.View
					style={rippleStyle}
					className="absolute left-1 top-1 inset-0 border-2 w-[18] h-[18] border-red-500 rounded-full"
				/>
				<View className="z-10">
					<CrossMarkIcon width={18} height={18} stroke={'#fff'} />
				</View>
			</View>
			<ThemeText className="text-black ml-1 flex-1">{text1}</ThemeText>
		</View>
	);
};

export default ErrorToast;
