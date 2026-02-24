import React from 'react';
import { View, Dimensions } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import customColor from '@/util/constant/color';
import { isTablet } from '@/util/helper/isTablet';
import { useColorScheme } from 'nativewind';

const screenWidth = Dimensions.get('screen').width;

const NotificationLoading = () => {
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
		<View
			style={{
				paddingBottom: 15,
				alignItems: 'center',
				flex: 1,
			}}
		>
			<SkeletonPlaceholder
				backgroundColor={backgroundColor}
				highlightColor={highlightColor}
				speed={1000}
			>
				<SkeletonPlaceholder.Item>
					<SkeletonPlaceholder.Item flexDirection="row" paddingTop={20}>
						{/* <SkeletonPlaceholder.Item
							marginTop={8}
							width={30}
							height={30}
							borderRadius={15}
						/> */}
						<SkeletonPlaceholder.Item marginLeft={8}>
							<SkeletonPlaceholder.Item
								flexDirection="row"
								alignItems="center"
								justifyContent="space-between"
							>
								<SkeletonPlaceholder.Item
									width={42}
									height={42}
									borderRadius={22}
								/>
								<SkeletonPlaceholder.Item
									width={75}
									height={15}
									borderRadius={10}
								/>
							</SkeletonPlaceholder.Item>
							{/* <SkeletonPlaceholder.Item>
								<SkeletonPlaceholder.Item
									width={isTablet ? screenWidth * 0.9 : 300}
									height={20}
									borderRadius={8}
									marginTop={10}
								/>
							</SkeletonPlaceholder.Item> */}
							<SkeletonPlaceholder.Item>
								<SkeletonPlaceholder.Item
									width={isTablet ? screenWidth * 0.9 : screenWidth * 0.85}
									height={80}
									borderRadius={10}
									marginTop={10}
								/>
							</SkeletonPlaceholder.Item>
						</SkeletonPlaceholder.Item>
					</SkeletonPlaceholder.Item>
					<SkeletonPlaceholder.Item flexDirection="row" paddingTop={20}>
						{/* <SkeletonPlaceholder.Item
							marginTop={8}
							width={30}
							height={30}
							borderRadius={15}
						/> */}
						<SkeletonPlaceholder.Item marginLeft={8}>
							<SkeletonPlaceholder.Item
								flexDirection="row"
								alignItems="center"
								justifyContent="space-between"
							>
								<SkeletonPlaceholder.Item
									width={42}
									height={42}
									borderRadius={42}
								/>
								<SkeletonPlaceholder.Item
									width={75}
									height={15}
									borderRadius={10}
								/>
							</SkeletonPlaceholder.Item>
							<SkeletonPlaceholder.Item>
								<SkeletonPlaceholder.Item
									width={isTablet ? screenWidth * 0.9 : screenWidth * 0.85}
									height={20}
									borderRadius={10}
									marginTop={10}
								/>
							</SkeletonPlaceholder.Item>
							<SkeletonPlaceholder.Item>
								<SkeletonPlaceholder.Item
									width={isTablet ? screenWidth * 0.9 : screenWidth * 0.85}
									height={80}
									borderRadius={10}
									marginTop={10}
								/>
							</SkeletonPlaceholder.Item>
						</SkeletonPlaceholder.Item>
					</SkeletonPlaceholder.Item>
					<SkeletonPlaceholder.Item flexDirection="row" paddingTop={20}>
						{/* <SkeletonPlaceholder.Item
							marginTop={8}
							width={30}
							height={30}
							borderRadius={15}
						/> */}
						<SkeletonPlaceholder.Item marginLeft={8}>
							<SkeletonPlaceholder.Item
								flexDirection="row"
								alignItems="center"
								justifyContent="space-between"
							>
								<SkeletonPlaceholder.Item
									width={42}
									height={42}
									borderRadius={42}
								/>
								<SkeletonPlaceholder.Item
									width={75}
									height={15}
									borderRadius={10}
								/>
							</SkeletonPlaceholder.Item>
							<SkeletonPlaceholder.Item>
								<SkeletonPlaceholder.Item
									width={isTablet ? screenWidth * 0.9 : screenWidth * 0.85}
									height={300}
									borderRadius={10}
									marginTop={10}
								/>
							</SkeletonPlaceholder.Item>
						</SkeletonPlaceholder.Item>
					</SkeletonPlaceholder.Item>
				</SkeletonPlaceholder.Item>
			</SkeletonPlaceholder>
		</View>
	);
};

export default NotificationLoading;
