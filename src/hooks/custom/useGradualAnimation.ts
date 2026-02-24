import { Platform } from 'react-native';
import { useKeyboardHandler } from 'react-native-keyboard-controller';
import { useSharedValue } from 'react-native-reanimated';

export const BottomBarHeight = Platform.OS === 'ios' ? 100 : 70;
export const useGradualAnimation = () => {
	const height = useSharedValue(0);
	const progress = useSharedValue(0);

	useKeyboardHandler(
		{
			onMove: e => {
				'worklet';
				height.value = e.height;
				progress.value = e.progress;
			},
			onEnd: e => {
				'worklet';
				height.value = e.height;
				progress.value = e.progress;
			},
		},
		[],
	);

	return { height, progress };
};
