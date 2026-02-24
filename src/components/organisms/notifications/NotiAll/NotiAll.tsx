import { Dimensions, View } from 'react-native';
import { useGetNormalNotification } from '@/hooks/queries/notifications.queries';
import NotificationTabItem from '@/components/molecules/notifications/NotificationTabItem/NotificationTabItem';
import { INotificationResponse } from '@/services/notification.service';
import Underline from '@/components/atoms/common/Underline/Underline';
import NotificationLoading from '@/components/atoms/loading/NotificationLoading';
import { FlashList } from '@shopify/flash-list';
import NotificationListEmpty from '@/components/atoms/notifications/NotificationListEmpty/NotificationListEmpty';
import { RefreshControl } from 'react-native';
import customColor from '@/util/constant/color';
import { CircleFade } from 'react-native-animated-spinkit';
import { flattenPages } from '@/util/helper/timeline';
import { useColorScheme } from 'nativewind';

const NotiAll = () => {
	const { colorScheme } = useColorScheme();
	const {
		data,
		isLoading,
		isFetching,
		refetch,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
	} = useGetNormalNotification();

	const notifications: INotificationResponse[] = flattenPages(data);

	const renderItem = ({ item }: { item: INotificationResponse }) => {
		return <NotificationTabItem item={item} />;
	};

	if (isLoading) return <NotificationLoading />;

	return (
		<FlashList
			data={notifications}
			renderItem={renderItem}
			ItemSeparatorComponent={Underline}
			showsVerticalScrollIndicator={false}
			refreshControl={
				<RefreshControl
					refreshing={isFetching}
					tintColor={
						colorScheme === 'dark'
							? customColor['patchwork-light-900']
							: customColor['patchwork-dark-100']
					}
					onRefresh={refetch}
				/>
			}
			ListEmptyComponent={<NotificationListEmpty />}
			onEndReached={() => {
				if (hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			}}
			onEndReachedThreshold={0.15}
			ListFooterComponent={
				<View className="items-center my-5">
					{isFetchingNextPage ? (
						<CircleFade
							size={25}
							color={colorScheme === 'dark' ? '#fff' : '#000'}
						/>
					) : (
						<></>
					)}
				</View>
			}
		/>
	);
};
export default NotiAll;
