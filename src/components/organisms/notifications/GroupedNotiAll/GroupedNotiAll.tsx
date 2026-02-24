import { Dimensions, View } from 'react-native';
import {
	useGetGroupedNotification,
	useGetNotificationMarker,
} from '@/hooks/queries/notifications.queries';
import Underline from '@/components/atoms/common/Underline/Underline';
import NotificationLoading from '@/components/atoms/loading/NotificationLoading';
import { FlashList } from '@shopify/flash-list';
import NotificationListEmpty from '@/components/atoms/notifications/NotificationListEmpty/NotificationListEmpty';
import { RefreshControl } from 'react-native';
import customColor from '@/util/constant/color';
import GroupedNotificationItem from '@/components/molecules/notifications/GroupedNotificationTabItem/GroupedNotificationTabItem';
import { CircleFade } from 'react-native-animated-spinkit';
import { flattenPages } from '@/util/helper/timeline';
import { useEffect } from 'react';
import { useMarkLastReadNotification } from '@/hooks/mutations/pushNoti.mutation';
import { queryClient } from '@/App';
import { useColorScheme } from 'nativewind';

const GroupedNotiAll = () => {
	const { colorScheme } = useColorScheme();
	const {
		data,
		isLoading,
		isFetching,
		refetch,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
	} = useGetGroupedNotification();

	const { data: notificationMarker } = useGetNotificationMarker();
	const { mutate: markAsRead, isPending } = useMarkLastReadNotification({
		onSuccess: newMarker => {
			queryClient.setQueryData<Patchwork.NotificationMarker>(
				['notification-marker'],
				old => newMarker,
			);
		},
	});

	const notifications: Patchwork.GroupedNotificationResults[] =
		flattenPages(data);
	const flattenedNotificationGroups = notifications.flatMap(
		item => item.notification_groups,
	);

	useEffect(() => {
		if (
			notificationMarker?.notifications &&
			flattenedNotificationGroups[0] &&
			isPending == false &&
			flattenedNotificationGroups[0]?.most_recent_notification_id >
				notificationMarker?.notifications?.last_read_id
		) {
			markAsRead({
				id: flattenedNotificationGroups[0].most_recent_notification_id,
			});
		}
	}, [notificationMarker, flattenedNotificationGroups, isPending]);

	useEffect(() => {
		if (flattenedNotificationGroups[0]) {
			markAsRead({
				id: flattenedNotificationGroups[0].most_recent_notification_id,
			});
		}
	}, []);

	const renderGroupedNotiItem = ({
		item,
	}: {
		item: Patchwork.NotificationGroup;
	}) => {
		const allAccounts = notifications?.flatMap(page => page?.accounts) ?? [];

		const filteredAccounts = allAccounts.filter(account =>
			item?.sample_account_ids?.includes(account?.id),
		);

		const accountsInfo = filteredAccounts.filter(
			(account, index, self) =>
				self.findIndex(a => a?.id === account?.id) === index,
		);
		const statusInfo = item.status_id
			? notifications
					.flatMap(page => page?.statuses || [])
					.find(status => status?.id === item?.status_id)
			: undefined;

		return (
			<GroupedNotificationItem
				notification={item}
				status={statusInfo || null}
				accounts={accountsInfo}
			/>
		);
	};

	if (isLoading) return <NotificationLoading />;

	return (
		<FlashList
			data={flattenedNotificationGroups}
			renderItem={renderGroupedNotiItem}
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
export default GroupedNotiAll;
