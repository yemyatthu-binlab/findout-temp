import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import ChannleProfilePostsLoading from './ChannelProfilePostsLoading';
import TimelineLoading from './TimelineLoading';
import customColor from '@/util/constant/color';
import { useColorScheme } from 'nativewind';
import colors, { gray, zinc } from 'tailwindcss/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

const ChannelProfileLoading = () => {
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
		<>
			<View style={{ paddingHorizontal: 20, paddingBottom: 15 }}>
				{/* <View
					style={{
						width: 80,
						height: 80,
						borderRadius: 4,
						backgroundColor:
							colorScheme === 'dark'
								? customColor['patchwork-dark-50']
								: zinc[200],
					}}
				/> */}
				<SkeletonPlaceholder
					backgroundColor={backgroundColor}
					highlightColor={highlightColor}
					speed={1000}
				>
					<SkeletonPlaceholder.Item>
						{/*Channel Name & account */}
						<SkeletonPlaceholder.Item>
							<SkeletonPlaceholder.Item
								width={80}
								height={80}
								borderRadius={4}
								zIndex={5}
							/>
							<SkeletonPlaceholder.Item
								width={150}
								height={13}
								borderRadius={4}
								marginTop={12}
							/>
							<SkeletonPlaceholder.Item
								width={100}
								height={13}
								borderRadius={4}
								marginTop={8}
							/>
						</SkeletonPlaceholder.Item>
					</SkeletonPlaceholder.Item>
				</SkeletonPlaceholder>
			</View>
			<ChannleProfilePostsLoading />
			<TimelineLoading />
			<TimelineLoading />
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	profileHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 24,
	},
	profileImage: {
		width: 70,
		height: 70,
		borderRadius: 35,
	},
	profileInfo: {
		marginLeft: 16,
		justifyContent: 'center',
	},
	channelName: {
		width: 120,
		height: 20,
		borderRadius: 4,
		marginBottom: 8,
	},
	metadata: {
		width: 180,
		height: 15,
		borderRadius: 4,
		marginBottom: 6,
	},
	followersSection: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 24,
	},
	followerCircle: {
		width: 50,
		height: 50,
		borderRadius: 25,
	},
	postsSection: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginBottom: 16,
	},
	tab: {
		width: SCREEN_WIDTH / 3 - 32,
		height: 40,
		borderRadius: 8,
	},
	post: {
		height: 120,
		borderRadius: 8,
		marginBottom: 16,
	},
});

export default ChannelProfileLoading;
