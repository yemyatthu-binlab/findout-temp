import React, { useCallback } from 'react';
import { Dimensions, RefreshControl } from 'react-native';
import { useMentionsNotifications } from '@/hooks/queries/notifications.queries';
import { INotificationResponse } from '@/services/notification.service';
import NotificationTabItem from '@/components/molecules/notifications/NotificationTabItem/NotificationTabItem';
import Underline from '@/components/atoms/common/Underline/Underline';
import NotificationLoading from '@/components/atoms/loading/NotificationLoading';
import { FlashList } from '@shopify/flash-list';
import NotificationListEmpty from '@/components/atoms/notifications/NotificationListEmpty/NotificationListEmpty';
import customColor from '@/util/constant/color';
import { useColorScheme } from 'nativewind';

const NotiMentions = () => {
	const { colorScheme } = useColorScheme();
	const {
		data,
		isSuccess,
		isFetching,
		refetch: refetchMentionNoti,
	} = useMentionsNotifications();

	const renderItem = useCallback(
		({ item }: { item: INotificationResponse }) => (
			<NotificationTabItem item={item} />
		),
		[],
	);
	if (!isSuccess) return <NotificationLoading />;

	return (
		<FlashList
			data={data}
			renderItem={renderItem}
			ItemSeparatorComponent={Underline}
			ListEmptyComponent={<NotificationListEmpty />}
			showsVerticalScrollIndicator={false}
			refreshControl={
				<RefreshControl
					refreshing={isFetching}
					tintColor={
						colorScheme === 'dark'
							? customColor['patchwork-light-900']
							: customColor['patchwork-dark-100']
					}
					onRefresh={refetchMentionNoti}
				/>
			}
		/>
	);
};

export default NotiMentions;
