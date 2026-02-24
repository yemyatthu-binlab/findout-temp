import customColor from '@/util/constant/color';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { ThemeText } from '../common/ThemeText/ThemeText';
import { useColorScheme } from 'nativewind';

export const AvatarLoading = ({
	title,
	cardCount = 1,
}: {
	title: string;
	cardCount?: number;
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
		<View style={{}}>
			<ThemeText className="font-NewsCycle_Bold my-2" size="lg_18">
				{title}
			</ThemeText>
			<SkeletonPlaceholder
				backgroundColor={backgroundColor}
				speed={1200}
				highlightColor={highlightColor}
			>
				<SkeletonPlaceholder.Item flexDirection="row">
					{Array(cardCount)
						.fill('')
						.map((_, index) => {
							return (
								<SkeletonPlaceholder.Item
									key={index}
									width={100}
									height={100}
									borderRadius={100}
									marginBottom={15}
									marginRight={11}
									overflow="hidden"
								/>
							);
						})}
				</SkeletonPlaceholder.Item>
			</SkeletonPlaceholder>
		</View>
	);
};

export default AvatarLoading;
