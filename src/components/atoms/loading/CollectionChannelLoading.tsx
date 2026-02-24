import customColor from '@/util/constant/color';
import { isTablet } from '@/util/helper/isTablet';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const CollectionChannelLoading = () => {
	const baseWidthClass = isTablet ? '31.5%' : '45%';
	const baseHeightClass = isTablet ? 300 : 150;

	const { colorScheme } = useColorScheme();

	const backgroundColor =
		colorScheme === 'dark'
			? customColor['skeleton-bg']
			: customColor['patchwork-grey-100'];
	const highlightColor =
		colorScheme === 'dark'
			? customColor['skeleton-highlight']
			: customColor['patchwork-grey-400'];

	return (
		<View style={{ flex: 1 }}>
			<SkeletonPlaceholder
				backgroundColor={backgroundColor}
				highlightColor={highlightColor}
				speed={1000}
			>
				<View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: 15 }}>
					{[...Array(8)].map((_, index) => (
						<View
							key={index}
							style={{
								width: baseWidthClass,
								margin: 8,
								height: baseHeightClass,
								borderRadius: 8,
							}}
						>
							<SkeletonPlaceholder.Item
								width="100%"
								height={baseHeightClass}
								borderRadius={8}
							/>
						</View>
					))}
				</View>
			</SkeletonPlaceholder>
		</View>
	);
};

export default CollectionChannelLoading;
