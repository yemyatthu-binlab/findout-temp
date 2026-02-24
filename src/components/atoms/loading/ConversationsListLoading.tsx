import customColor from '@/util/constant/color';
import { Dimensions, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const { width } = Dimensions.get('window');

const ConversationsListLoading = () => {
	return (
		<View className="mb-1 mx-3 my-3 ml-5">
			<SkeletonPlaceholder
				backgroundColor={customColor['skeleton-bg']}
				highlightColor={customColor['skeleton-highlight']}
				speed={1000}
			>
				<SkeletonPlaceholder.Item
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						marginBottom: 15,
					}}
				>
					<SkeletonPlaceholder.Item width={50} height={50} borderRadius={50} />
					<SkeletonPlaceholder.Item style={{ marginLeft: 10 }}>
						<View
							style={{
								width: width * 0.6,
								height: 12,
								borderRadius: 6,
							}}
						/>
						<View
							style={{
								marginTop: 10,
								width: width * 0.5,
								height: 12,
								borderRadius: 6,
							}}
						/>
					</SkeletonPlaceholder.Item>
				</SkeletonPlaceholder.Item>
			</SkeletonPlaceholder>
		</View>
	);
};

export default ConversationsListLoading;
