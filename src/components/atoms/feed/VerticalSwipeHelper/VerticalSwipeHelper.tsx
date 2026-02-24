import { useSharedScrollY } from '@/context/sharedScrollContext/sharedScroll.context';
import { View, Text, Dimensions } from 'react-native';
import Animated, {
	interpolate,
	useAnimatedStyle,
} from 'react-native-reanimated';

const VerticalSwipeHelper = () => {
	const sharedScrollYOffset = useSharedScrollY('Channel');
	const deviceHeight = Dimensions.get('screen').height;

	const animatedBarStyle = useAnimatedStyle(() => {
		const height = interpolate(
			sharedScrollYOffset.value,
			[0, deviceHeight * 0.7],
			[deviceHeight * 0.3, deviceHeight * 0.68],
			'clamp',
		);

		return {
			height,
		};
	});

	return (
		<Animated.View
			style={[
				{
					position: 'absolute',
					width: 46,
					height: Dimensions.get('screen').height * 0.35,
					left: 0,
					bottom: 0,
					zIndex: 900,
				},
				animatedBarStyle,
			]}
		/>
	);
};

export default VerticalSwipeHelper;
