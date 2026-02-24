import BackButton from '@/components/atoms/common/BackButton/BackButton';
import Header from '@/components/atoms/common/Header/Header';
import ListEmptyComponent from '@/components/atoms/common/ListEmptyComponent/ListEmptyComponent';
import StatusWrapper from '@/components/organisms/feed/StatusWrapper/StatusWrapper';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import { useGetBookmarkList } from '@/hooks/queries/statusActions.queries';
import { useSelectedDomain } from '@/store/feed/activeDomain';
import customColor from '@/util/constant/color';
import { flattenPages } from '@/util/helper/timeline';
import { FlashList } from '@shopify/flash-list';
import { useColorScheme } from 'nativewind';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, RefreshControl, View } from 'react-native';
import { CircleFade, Flow } from 'react-native-animated-spinkit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BookmarkList = () => {
	const domain_name = useSelectedDomain();
	const { bottom } = useSafeAreaInsets();
	const { colorScheme } = useColorScheme();
	const { t } = useTranslation();

	const queryParams = {
		domain_name,
		remote: false,
		only_media: false,
	};

	const {
		data: bookmarks,
		hasNextPage,
		fetchNextPage,
		isLoading,
		isFetching,
		refetch: refetchBookmarks,
		isRefetching,
		isFetchingNextPage,
	} = useGetBookmarkList(queryParams);

	const feed = useMemo(() => flattenPages(bookmarks), [bookmarks]);

	const handleOnEndReached = () => {
		if (hasNextPage) {
			return fetchNextPage();
		}
	};

	return (
		<SafeScreen>
			<Header
				title={t('screen.bookmarks')}
				leftCustomComponent={<BackButton />}
			/>
			{!isLoading ? (
				<FlashList
					data={feed}
					contentContainerStyle={{
						paddingBottom: bottom,
						backgroundColor:
							colorScheme === 'dark'
								? customColor['patchwork-dark-100']
								: '#ffffff',
					}}
					renderItem={({ item }) => {
						if (item && item?.account) {
							return (
								<StatusWrapper
									status={item}
									currentPage="BookmarkList"
									statusType={item.reblog ? 'reblog' : 'normal'}
									extraPayload={{ domain_name }}
								/>
							);
						}
						return <></>;
					}}
					refreshControl={
						<RefreshControl
							refreshing={isRefetching}
							tintColor={
								colorScheme === 'dark'
									? customColor['patchwork-light-900']
									: customColor['patchwork-dark-100']
							}
							onRefresh={refetchBookmarks}
						/>
					}
					ListEmptyComponent={() => {
						return (
							<ListEmptyComponent title={t('timeline.no_bookmarks_desc')} />
						);
					}}
					onEndReachedThreshold={0.15}
					onEndReached={handleOnEndReached}
					showsVerticalScrollIndicator={false}
					ListFooterComponent={
						isFetchingNextPage ? (
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
			)}
		</SafeScreen>
	);
};

export default BookmarkList;
