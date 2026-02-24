import {
	useSharedValue,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	interpolate,
	Extrapolation,
} from 'react-native-reanimated';

const HEADER_CONTENT_HEIGHT = 250;
const HEADER_TRANSITION_POINT = HEADER_CONTENT_HEIGHT - 100;

export const useAnimatedHeader = () => {
	const scrollY = useSharedValue(0);

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: event => {
			scrollY.value = event.contentOffset.y;
		},
	});

	const animatedHeaderStyle = useAnimatedStyle(() => {
		const opacity = interpolate(
			scrollY.value,
			[HEADER_TRANSITION_POINT, HEADER_TRANSITION_POINT + 40],
			[0, 1],
			Extrapolation.CLAMP,
		);
		return { opacity };
	});

	const animatedTitleStyle = useAnimatedStyle(() => {
		const opacity = interpolate(
			scrollY.value,
			[HEADER_TRANSITION_POINT + 10, HEADER_TRANSITION_POINT + 50],
			[0, 1],
			Extrapolation.CLAMP,
		);
		return { opacity };
	});

	return {
		scrollHandler,
		animatedHeaderStyle,
		animatedTitleStyle,
		scrollY,
	};
};
