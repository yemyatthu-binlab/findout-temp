import { queryClient } from '@/App';
import BackButton from '@/components/atoms/common/BackButton/BackButton';
import Header from '@/components/atoms/common/Header/Header';
import ListEmptyComponent from '@/components/atoms/common/ListEmptyComponent/ListEmptyComponent';
import HashtagHeader from '@/components/molecules/feed/HashtagHeader/HashtagHeader';
import StatusWrapper from '@/components/organisms/feed/StatusWrapper/StatusWrapper';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import { useHashtagDetailFeedQuery } from '@/hooks/queries/feed.queries';
import { useHashTagDetailQuery } from '@/hooks/queries/hashtag.queries';
import { useActiveDomainStore } from '@/store/feed/activeDomain';
import { HomeStackScreenProps } from '@/types/navigation';
import { HashtagDetailFeedQueryKey } from '@/types/queries/feed.type';
import customColor from '@/util/constant/color';
import { flattenPages } from '@/util/helper/timeline';
import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { useColorScheme } from 'nativewind';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, RefreshControl, View } from 'react-native';
import { CircleFade, Flow } from 'react-native-animated-spinkit';

const HashTagDetail: React.FC<HomeStackScreenProps<'HashTagDetail'>> = ({
	route,
	navigation,
}) => {
	const { t } = useTranslation();
	const { colorScheme } = useColorScheme();
	const { domain_name: activeDomain } = useActiveDomainStore();
	const { hashtag, hashtagDomain: domain_name } = route.params;

	const queryKey: HashtagDetailFeedQueryKey = [
		'hashtag-detail-feed',
		{
			domain_name,
			hashtag,
		},
	];

	const {
		data: timeline,
		hasNextPage,
		fetchNextPage,
		isFetching,
		refetch: refetchHashTagFeed,
	} = useHashtagDetailFeedQuery({
		domain_name,
		hashtag,
	});

	const { data: hashtagDetail, refetch: refetchHashTagDetail } =
		useHashTagDetailQuery({
			domain_name: activeDomain,
			hashtag,
		});

	const onTimelineContentLoadMore = () => {
		if (hasNextPage) {
			return fetchNextPage();
		}
	};

	const handleRefresh = () => {
		refetchHashTagFeed();
		refetchHashTagDetail();
	};

	useFocusEffect(
		useCallback(() => {
			queryClient.invalidateQueries({ queryKey });
		}, []),
	);
	return (
		<SafeScreen>
			<Header
				title={`#${hashtag}`}
				leftCustomComponent={
					<BackButton
						customOnPress={() => {
							navigation.goBack();
						}}
					/>
				}
			/>
			{hashtagDetail && timeline ? (
				<FlashList
					data={flattenPages(timeline)}
					keyExtractor={item => item.id}
					renderItem={({ item }) => {
						return (
							<StatusWrapper
								status={item}
								currentPage="Hashtag"
								statusType={item.reblog ? 'reblog' : 'normal'}
								extraPayload={{ hashtag, domain_name }}
							/>
						);
					}}
					ListHeaderComponent={() => (
						<HashtagHeader hashtagDetail={hashtagDetail} hashtag={hashtag} />
					)}
					ListEmptyComponent={() => (
						<ListEmptyComponent title={t('hashtag_detail.no_hashtags_found')} />
					)}
					refreshControl={
						<RefreshControl
							refreshing={isFetching}
							tintColor={colorScheme == 'dark' ? 'white' : 'black'}
							onRefresh={handleRefresh}
						/>
					}
					onEndReachedThreshold={0.15}
					onEndReached={onTimelineContentLoadMore}
					showsVerticalScrollIndicator={false}
					ListFooterComponent={
						isFetching ? (
							<View className="my-3 items-center">
								<CircleFade
									size={25}
									color={colorScheme === 'dark' ? '#fff' : '#000'}
								/>
							</View>
						) : (
							<></>
						)
					}
				/>
			) : (
				<View className="flex-1 items-center justify-center">
					<Flow
						size={50}
						color={
							colorScheme === 'dark'
								? customColor['patchwork-primary-dark']
								: customColor['patchwork-primary']
						}
					/>
				</View>
			)}
		</SafeScreen>
	);
};

export default HashTagDetail;
