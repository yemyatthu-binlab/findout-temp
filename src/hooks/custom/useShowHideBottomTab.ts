import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useColorScheme } from 'nativewind';
import { Platform } from 'react-native';
import Animated, {
	SharedValue,
	useAnimatedReaction,
	useSharedValue,
} from 'react-native-reanimated';
import useDebounce from './useDebounce';
import customColor from '@/util/constant/color';
import { useEffect } from 'react';
import { HomeStackParamList } from '@/types/navigation';
import { runOnJS } from 'react-native-worklets';

export const SolidHeaderDepth = Platform.OS === 'ios' ? 140 : 160;

type Props = {
	sharedScrollYOffset: SharedValue<number>;
};

const useShowHideBottomTab = ({ sharedScrollYOffset }: Props) => {
	const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
	const { colorScheme } = useColorScheme();
	const isTabBarVisible = useSharedValue(true);
	const lastScrollDirection = useSharedValue<'up' | 'down'>('up');
	const lastTogglePosition = useSharedValue(0);
	const startDebounce = useDebounce();

	const setTabBarVisibility = (visible: boolean, executeTime?: number) => {
		startDebounce(() => {
			navigation.getParent()?.setOptions({
				tabBarStyle: {
					display: visible ? 'flex' : 'none',
					backgroundColor:
						colorScheme === 'dark' ? customColor['patchwork-dark-100'] : '#fff',
					height: visible ? (Platform.OS == 'ios' ? 100 : 70) : 0,
				},
			});
		}, executeTime || 300);
	};

	useAnimatedReaction(
		() => sharedScrollYOffset.value,
		(current, previous) => {
			if (previous === null || previous === undefined) return;
			if (Math.abs(current - previous) < 15) return;
			lastScrollDirection.value = current > previous ? 'down' : 'up';
		},
	);

	useAnimatedReaction(
		() => ({
			y: sharedScrollYOffset.value,
			direction: lastScrollDirection.value,
		}),
		({ y, direction }, previous) => {
			const scrollThreshold = SolidHeaderDepth + 40;
			if (
				direction === 'down' &&
				y > scrollThreshold &&
				isTabBarVisible.value &&
				Math.abs(y - lastTogglePosition.value) > 400
			) {
				runOnJS(setTabBarVisibility)(false);
				lastTogglePosition.value = y;
				isTabBarVisible.value = false;
			} else if (
				direction === 'up' &&
				!isTabBarVisible.value &&
				Math.abs(y - lastTogglePosition.value) > 400
			) {
				runOnJS(setTabBarVisibility)(true);
				lastTogglePosition.value = y;
				isTabBarVisible.value = true;
			}
		},
	);

	useEffect(() => {
		const beforeRemoveListener = navigation.addListener('blur', e => {
			setTabBarVisibility(true, 1);
			isTabBarVisible.value = true;
		});
		return () => {
			navigation.removeListener('blur', beforeRemoveListener);
		};
	}, [navigation]);
};

export default useShowHideBottomTab;
