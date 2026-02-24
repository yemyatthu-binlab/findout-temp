import customColor from '@/util/constant/color';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import colors from 'tailwindcss/colors';

export const ServerInstanceLoading = () => {
	const { colorScheme } = useColorScheme();

	const backgroundColor =
		colorScheme === 'dark' ? customColor['skeleton-bg'] : colors.slate[200];
	const highlightColor =
		colorScheme === 'dark'
			? customColor['skeleton-highlight']
			: colors.slate[100];

	return (
		<View>
			<SkeletonPlaceholder
				backgroundColor={backgroundColor}
				highlightColor={highlightColor}
				speed={1200}
			>
				<>
					<SkeletonPlaceholder.Item
						width={'100%'}
						height={240}
						borderTopLeftRadius={6}
						borderTopRightRadius={6}
						marginRight={11}
						marginBottom={20}
						overflow="hidden"
					/>
					<SkeletonPlaceholder.Item
						width={150}
						height={10}
						borderRadius={5}
						marginLeft={11}
						marginBottom={5}
						overflow="hidden"
					/>
					<SkeletonPlaceholder.Item
						width={200}
						height={10}
						borderRadius={5}
						marginLeft={11}
						marginBottom={5}
						overflow="hidden"
					/>
					<SkeletonPlaceholder.Item
						width={180}
						height={10}
						borderRadius={5}
						marginLeft={11}
						marginBottom={5}
						overflow="hidden"
					/>
					<SkeletonPlaceholder.Item
						width={120}
						height={10}
						borderRadius={5}
						marginLeft={11}
						marginBottom={20}
						overflow="hidden"
					/>
				</>
			</SkeletonPlaceholder>
		</View>
	);
};
