import { View, Pressable } from 'react-native';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import Underline from '@/components/atoms/common/Underline/Underline';
import { calculateHashTagCount } from '@/util/helper/helper';
import { ChevronRightIcon, FireIcon } from '@/util/svg/icon.common';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SearchStackParamList } from '@/types/navigation';
import { useSelectedDomain } from '@/store/feed/activeDomain';
import { useColorScheme } from 'nativewind';

interface HashTagsBySearchProps {
	loading: boolean;
	trendingHashTags: Patchwork.HashtagDetail[];
}

const HashTagsBySearch = ({
	loading,
	trendingHashTags,
}: HashTagsBySearchProps) => {
	const domain_name = useSelectedDomain();
	const { colorScheme } = useColorScheme();
	const navigation = useNavigation<StackNavigationProp<SearchStackParamList>>();

	const navigateToHashTagDetail = (
		hashTagName: Patchwork.HashtagDetail['name'],
	) => {
		navigation.navigate('HashTagDetail', {
			hashtag: hashTagName,
			hashtagDomain: domain_name,
		});
	};

	return (
		<>
			{trendingHashTags && trendingHashTags?.length > 0 ? (
				<View className="mx-4 mt-4">
					<View className="flex-row items-center justify-between">
						<View className="flex-1 flex-row items-center">
							<FireIcon className="h-5 w-5" />
							<ThemeText
								className="font-NewsCycle_Bold flex-1 ml-3"
								size="lg_18"
							>
								Trending
							</ThemeText>
						</View>
					</View>
					{Array.isArray(trendingHashTags) &&
						trendingHashTags.slice(0, 4).map((hashtag, index) => (
							<Pressable
								key={index}
								onPress={() => navigateToHashTagDetail(hashtag.name)}
							>
								<View className="flex-row items-center my-2">
									<View className="flex-1">
										<ThemeText className="font-NewsCycle_Bold" size="md_16">
											#{hashtag.name}
										</ThemeText>
										<ThemeText className="opacity-60">{`${calculateHashTagCount(
											hashtag.history,
											'uses',
										)} posts from ${calculateHashTagCount(
											hashtag.history,
											'accounts',
										)} participants`}</ThemeText>
									</View>
									<ChevronRightIcon colorScheme={colorScheme} />
								</View>
								<Underline />
							</Pressable>
						))}
				</View>
			) : (
				<></>
			)}
		</>
	);
};

export default HashTagsBySearch;
