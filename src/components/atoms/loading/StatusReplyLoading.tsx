import customColor from '@/util/constant/color';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export const StatusReplyLoading = () => {
	return (
		<View className="mx-4 my-4">
			<SkeletonPlaceholder
				backgroundColor={customColor['skeleton-bg']}
				speed={1200}
				highlightColor={customColor['skeleton-highlight']}
			>
				<SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
					<SkeletonPlaceholder.Item
						width={33}
						height={33}
						borderRadius={33}
					></SkeletonPlaceholder.Item>
					<SkeletonPlaceholder.Item>
						<SkeletonPlaceholder.Item
							width={90}
							height={9}
							borderRadius={4}
							marginLeft={10}
						></SkeletonPlaceholder.Item>
						<SkeletonPlaceholder.Item
							width={70}
							height={9}
							borderRadius={4}
							marginLeft={10}
							marginTop={5}
						></SkeletonPlaceholder.Item>
					</SkeletonPlaceholder.Item>
				</SkeletonPlaceholder.Item>
			</SkeletonPlaceholder>
			<SkeletonPlaceholder
				backgroundColor={customColor['skeleton-bg']}
				speed={1200}
				highlightColor={customColor['skeleton-highlight']}
			>
				<SkeletonPlaceholder.Item marginLeft={0} marginTop={15}>
					<SkeletonPlaceholder.Item
						width={220}
						height={9}
						borderRadius={4}
						marginLeft={10}
					></SkeletonPlaceholder.Item>
					<SkeletonPlaceholder.Item
						width={180}
						height={9}
						borderRadius={4}
						marginLeft={10}
						marginTop={5}
					></SkeletonPlaceholder.Item>
					<SkeletonPlaceholder.Item
						width={220}
						height={9}
						borderRadius={4}
						marginLeft={10}
						marginTop={5}
					></SkeletonPlaceholder.Item>
				</SkeletonPlaceholder.Item>
			</SkeletonPlaceholder>
			<SkeletonPlaceholder
				backgroundColor={customColor['skeleton-bg']}
				speed={1200}
				highlightColor={customColor['skeleton-highlight']}
			>
				<SkeletonPlaceholder.Item
					marginLeft={0}
					marginTop={15}
					flexDirection="row"
				>
					<SkeletonPlaceholder.Item
						width={20}
						height={20}
						borderRadius={20}
						marginLeft={10}
					></SkeletonPlaceholder.Item>
					<SkeletonPlaceholder.Item
						width={20}
						height={20}
						borderRadius={20}
						marginLeft={10}
					></SkeletonPlaceholder.Item>
					<SkeletonPlaceholder.Item
						width={20}
						height={20}
						borderRadius={20}
						marginLeft={10}
					></SkeletonPlaceholder.Item>
				</SkeletonPlaceholder.Item>
			</SkeletonPlaceholder>
		</View>
	);
};
