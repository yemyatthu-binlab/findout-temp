import customColor from '@/util/constant/color';
import { ScrollView, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export const UserSuggestionLoading = () => {
	return (
		<ScrollView
			className="my-3"
			keyboardShouldPersistTaps="always"
			horizontal
			showsHorizontalScrollIndicator={false}
		>
			<SkeletonPlaceholder
				backgroundColor={customColor['skeleton-bg']}
				speed={1600}
				highlightColor={customColor['skeleton-highlight']}
			>
				<SkeletonPlaceholder.Item flexDirection="row">
					{Array(4)
						.fill('')
						.map(() => (
							<SkeletonPlaceholder.Item
								flexDirection="row"
								alignItems="center"
								marginRight={12}
							>
								<SkeletonPlaceholder.Item
									borderRadius={16}
									width={32}
									height={32}
								/>
								<SkeletonPlaceholder.Item marginLeft={3}>
									<SkeletonPlaceholder.Item
										width={60}
										height={6}
										borderRadius={4}
										marginBottom={5}
									/>
									<SkeletonPlaceholder.Item
										width={90}
										height={6}
										borderRadius={4}
									/>
								</SkeletonPlaceholder.Item>
							</SkeletonPlaceholder.Item>
						))}
				</SkeletonPlaceholder.Item>
			</SkeletonPlaceholder>
		</ScrollView>
	);
};

export default UserSuggestionLoading;
