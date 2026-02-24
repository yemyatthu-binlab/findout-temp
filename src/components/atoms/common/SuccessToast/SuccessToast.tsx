import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withRepeat,
	withTiming,
	Easing,
} from 'react-native-reanimated';
import { ThemeText } from '../ThemeText/ThemeText';
import { CheckMarkIcon } from '@/util/svg/icon.common';

const SuccessToast = ({ text1 }: { text1: string }) => {
	const rotation = useSharedValue(0);

	useEffect(() => {
		rotation.value = withRepeat(
			withTiming(35, {
				duration: 500,
				easing: Easing.inOut(Easing.ease),
			}),
			-1,
			true,
		);
	}, []);

	const animatedStyles = useAnimatedStyle(() => ({
		transform: [{ rotate: `${rotation.value}deg` }],
	}));

	return (
		<View className="mt-4 bg-white border-l-2 border-l-green-500 items-center rounded-tr-md rounded-br-md shadow-md py-4 px-3 mx-1 flex-row flex-1 w-11/12">
			<Animated.View
				style={animatedStyles}
				className="rounded-full mr-2 bg-green-500 p-1"
			>
				<CheckMarkIcon width={18} height={18} stroke={'#fff'} />
			</Animated.View>
			<ThemeText className="text-black ml-1 flex-1">{text1}</ThemeText>
		</View>
	);
};

export default SuccessToast;
