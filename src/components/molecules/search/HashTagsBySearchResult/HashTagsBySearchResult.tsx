import { View, Pressable } from 'react-native';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import Underline from '@/components/atoms/common/Underline/Underline';
import { calculateHashTagCount } from '@/util/helper/helper';
import { ChevronRightIcon } from '@/util/svg/icon.common';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SearchStackParamList } from '@/types/navigation';
import { useSelectedDomain } from '@/store/feed/activeDomain';
import { useTranslation } from 'react-i18next';

interface HashTagsBySearchResultProps {
	hashtagsSearchResult: Patchwork.HashtagDetail[];
}

const HashTagsBySearchResult = ({
	hashtagsSearchResult,
}: HashTagsBySearchResultProps) => {
	const { t } = useTranslation();
	const domain_name = useSelectedDomain();
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
			{hashtagsSearchResult.length > 0 ? (
				<View className="mx-4 mt-2">
					<View className="flex-row items-center justify-between">
						<View className="flex-1 flex-row items-center">
							<ThemeText className="font-NewsCycle_Bold" size="lg_18">
								{t('hashtags')}
							</ThemeText>
						</View>
					</View>
					{Array.isArray(hashtagsSearchResult) &&
						hashtagsSearchResult.slice(0, 4).map((hashtag, index) => (
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
										)} ${t('hashtag_detail.post', {
											count: calculateHashTagCount(hashtag.history, 'uses'),
										})} ${t('hashtag_detail.from')} ${calculateHashTagCount(
											hashtag.history,
											'accounts',
										)} ${t('hashtag_detail.participant', {
											count: calculateHashTagCount(hashtag.history, 'accounts'),
										})}`}</ThemeText>
									</View>
									<ChevronRightIcon />
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

export default HashTagsBySearchResult;
