import customColor from '@/util/constant/color';
import { isTablet } from '@/util/helper/isTablet';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

type Props = {
	isMediaPlaceholder?: boolean;
	borderLineVisible?: boolean;
	style?: StyleProp<ViewStyle>;
};

const TimelineLoading: React.FC<Props> = ({
	isMediaPlaceholder = false,
	borderLineVisible = false,
	style,
}) => {
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
		<View style={[{ padding: 20 }, style]}>
			<SkeletonPlaceholder
				backgroundColor={backgroundColor}
				highlightColor={highlightColor}
				speed={1000}
			>
				<SkeletonPlaceholder.Item>
					<SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
						<SkeletonPlaceholder.Item
							width={40}
							height={40}
							borderRadius={50}
						/>
						<SkeletonPlaceholder.Item marginLeft={8}>
							<SkeletonPlaceholder.Item
								width={100}
								height={10}
								borderRadius={4}
								marginBottom={8}
							/>
							<SkeletonPlaceholder.Item
								width={150}
								height={8}
								borderRadius={4}
							/>
						</SkeletonPlaceholder.Item>
					</SkeletonPlaceholder.Item>
					<SkeletonPlaceholder.Item
						width={'100%'}
						height={isTablet ? 230 : 100}
						borderRadius={8}
						marginTop={10}
					/>
					<SkeletonPlaceholder.Item
						marginTop={10}
						flexDirection="row"
						alignItems="center"
						justifyContent="space-between"
					>
						<SkeletonPlaceholder.Item flexDirection="row" gap={8}>
							<SkeletonPlaceholder.Item
								width={24}
								height={24}
								borderRadius={50}
							/>
							<SkeletonPlaceholder.Item
								width={24}
								height={24}
								borderRadius={50}
							/>
							<SkeletonPlaceholder.Item
								width={24}
								height={24}
								borderRadius={50}
							/>
						</SkeletonPlaceholder.Item>
						<SkeletonPlaceholder.Item flexDirection="row" gap={8}>
							<SkeletonPlaceholder.Item
								width={24}
								height={24}
								borderRadius={50}
							/>
							<SkeletonPlaceholder.Item
								width={24}
								height={24}
								borderRadius={50}
							/>
							<SkeletonPlaceholder.Item
								width={24}
								height={24}
								borderRadius={50}
							/>
						</SkeletonPlaceholder.Item>
					</SkeletonPlaceholder.Item>
				</SkeletonPlaceholder.Item>
			</SkeletonPlaceholder>
		</View>
	);
};

export default TimelineLoading;
