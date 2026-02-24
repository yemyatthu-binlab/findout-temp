import { RootStackParamList } from '@/types/navigation';
import { cn } from '@/util/helper/twutil';
import { BackIcon } from '@/util/svg/icon.common';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useColorScheme } from 'nativewind';
import { Pressable, Insets } from 'react-native';
import { throttle } from 'lodash';
import { useEffect, useState } from 'react';

type Props = {
	customOnPress?: () => void;
	forceLight?: boolean;
	extraClass?: string;
	hitSlop?: Insets;
};

const BackButton = ({
	customOnPress = undefined,
	forceLight,
	extraClass,
	hitSlop,
}: Props) => {
	const { colorScheme } = useColorScheme();
	const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
	const isFocused = useIsFocused();
	const [isButtonActive, setIsButtonActive] = useState(false);

	useEffect(() => {
		if (isFocused) {
			const activationTimer = setTimeout(() => {
				setIsButtonActive(true);
			}, 350);

			return () => {
				clearTimeout(activationTimer);
				setIsButtonActive(false);
			};
		} else {
			setIsButtonActive(false);
		}
	}, [isFocused]);

	const handlePress = () => {
		if (customOnPress) {
			customOnPress();
		} else {
			// throttle(() => {
			// 	navigation.goBack();
			// }, 300)();
			navigation.goBack();
		}
	};

	return (
		<Pressable
			onPress={handlePress}
			disabled={!isButtonActive}
			hitSlop={hitSlop || { top: 10, bottom: 10, left: 10, right: 10 }}
			className={cn(
				'w-10 h-10 items-center justify-center rounded-full border-[1px] border-patchwork-grey-100',
				extraClass,
				!isButtonActive && 'opacity-50',
			)}
		>
			<BackIcon colorScheme={colorScheme} forceLight={!!forceLight} />
		</Pressable>
	);
};

export default BackButton;
