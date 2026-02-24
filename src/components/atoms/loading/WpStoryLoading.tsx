import customColor from '@/util/constant/color';
import { isTablet } from '@/util/helper/isTablet';
import { useColorScheme } from 'nativewind';
import { ScrollView, View } from 'react-native'; // Import ScrollView and View
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export const useBgColor = () => {
	const { colorScheme } = useColorScheme();
	const backgroundColor =
		colorScheme === 'dark'
			? customColor['skeleton-bg']
			: customColor['patchwork-grey-100'];
	const highlightColor =
		colorScheme === 'dark'
			? customColor['skeleton-highlight']
			: customColor['patchwork-grey-400'];
	return { backgroundColor, highlightColor };
};

export const HorizontalSkeleton = () => {
	const { backgroundColor, highlightColor } = useBgColor();
	return (
		<ScrollView horizontal showsHorizontalScrollIndicator={false}>
			<SkeletonPlaceholder
				backgroundColor={backgroundColor}
				speed={1200}
				highlightColor={highlightColor}
			>
				<SkeletonPlaceholder.Item flexDirection="row">
					<SkeletonPlaceholder.Item
						width={isTablet ? 340 : 280}
						height={isTablet ? 280 : 160}
						borderRadius={8}
						marginRight={16}
					/>
					<SkeletonPlaceholder.Item
						width={isTablet ? 340 : 280}
						height={isTablet ? 280 : 160}
						borderRadius={8}
						marginRight={16}
					/>
					<SkeletonPlaceholder.Item
						width={isTablet ? 340 : 280}
						height={isTablet ? 280 : 160}
						borderRadius={8}
						marginRight={16}
					/>
				</SkeletonPlaceholder.Item>
			</SkeletonPlaceholder>
		</ScrollView>
	);
};

export const VerticalSkeleton = () => {
	const { backgroundColor, highlightColor } = useBgColor();
	// An array is used to easily render multiple skeleton items for a more realistic list preview.
	const skeletonItems = Array.from({ length: 3 });

	return (
		<SkeletonPlaceholder
			backgroundColor={backgroundColor}
			speed={1200}
			highlightColor={highlightColor}
		>
			<View>
				{skeletonItems.map((_, index) => (
					<SkeletonPlaceholder.Item
						key={index}
						flexDirection="row"
						alignItems="center"
						marginBottom={16}
					>
						<SkeletonPlaceholder.Item width={64} height={64} borderRadius={8} />
						<SkeletonPlaceholder.Item marginLeft={16} flex={1}>
							<SkeletonPlaceholder.Item
								width="90%"
								height={20}
								borderRadius={4}
							/>
							<SkeletonPlaceholder.Item
								marginTop={6}
								width="60%"
								height={15}
								borderRadius={4}
							/>
						</SkeletonPlaceholder.Item>
					</SkeletonPlaceholder.Item>
				))}
			</View>
		</SkeletonPlaceholder>
	);
};
