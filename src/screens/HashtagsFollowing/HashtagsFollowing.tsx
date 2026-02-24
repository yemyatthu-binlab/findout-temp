import { View, RefreshControl, FlatList, Pressable } from 'react-native';
import { Flow } from 'react-native-animated-spinkit';
import BackButton from '@/components/atoms/common/BackButton/BackButton';
import Header from '@/components/atoms/common/Header/Header';
import ListEmptyComponent from '@/components/atoms/common/ListEmptyComponent/ListEmptyComponent';
import Underline from '@/components/atoms/common/Underline/Underline';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import customColor from '@/util/constant/color';
import { useGetHashtagsFollowing } from '@/hooks/queries/hashtag.queries';
import { useSelectedDomain } from '@/store/feed/activeDomain';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { useNavigation } from '@react-navigation/native';
import { HomeStackScreenProps } from '@/types/navigation';
import { ChevronRightIcon } from '@/util/svg/icon.common';
import { calculateHashTagCount } from '@/util/helper/helper';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';

const HashtagsFollowing = () => {
	const navigation =
		useNavigation<HomeStackScreenProps<'HomeFeed'>['navigation']>();
	const domain_name = useSelectedDomain();
	const { colorScheme } = useColorScheme();
	const { data, isLoading, isRefetching, refetch } = useGetHashtagsFollowing({
		domain_name,
	});
	const { t } = useTranslation();

	const navigateToHashTagDetail = (name: string) => {
		navigation.navigate('HashTagDetail', {
			hashtag: name,
			hashtagDomain: domain_name,
		});
	};

	return (
		<SafeScreen>
			<Header
				title={t('screen.hashtags')}
				leftCustomComponent={<BackButton />}
				underlineClassName="mb-0"
			/>

			{isLoading ? (
				<View className="flex-1 justify-center items-center">
					<Flow
						size={50}
						color={
							colorScheme === 'dark'
								? customColor['patchwork-primary-dark']
								: customColor['patchwork-primary']
						}
					/>
				</View>
			) : (
				<FlatList
					data={data}
					keyExtractor={item => item.name}
					renderItem={({ item }) => (
						<Pressable
							onPress={() => navigateToHashTagDetail(item.name)}
							className="px-6"
						>
							<View className="flex-row items-center my-2">
								<View className="flex-1">
									<ThemeText className="font-NewsCycle_Bold" size="md_16">
										#{item.name}
									</ThemeText>
									<ThemeText className="opacity-60">
										{`${calculateHashTagCount(item.history, 'uses')} ${t(
											'hashtag_detail.post',
											{ count: calculateHashTagCount(item.history, 'uses') },
										)} from ${calculateHashTagCount(
											item.history,
											'accounts',
										)} ${t('hashtag_detail.participant', {
											count: calculateHashTagCount(item.history, 'accounts'),
										})}`}
									</ThemeText>
								</View>
								<ChevronRightIcon />
							</View>
						</Pressable>
					)}
					refreshControl={
						<RefreshControl
							refreshing={isRefetching}
							tintColor={colorScheme == 'dark' ? 'white' : 'black'}
							onRefresh={refetch}
						/>
					}
					ListEmptyComponent={() => {
						return (
							<ListEmptyComponent
								title={t('hashtag_detail.no_hashtags_found')}
							/>
						);
					}}
					ItemSeparatorComponent={Underline}
					showsVerticalScrollIndicator={false}
				/>
			)}
		</SafeScreen>
	);
};

export default HashtagsFollowing;
