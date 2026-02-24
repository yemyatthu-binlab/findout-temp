import React, {
	forwardRef,
	useImperativeHandle,
	useRef,
	useCallback,
	useEffect,
} from 'react';
import {
	View,
	RefreshControl,
	ViewToken,
	DeviceEventEmitter,
} from 'react-native'; // Added ViewToken
import { Tabs } from 'react-native-collapsible-tab-view';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CircleFade } from 'react-native-animated-spinkit';
import { FlashListRef } from '@shopify/flash-list';

import customColor from '@/util/constant/color';
import StatusWrapper from '../../feed/StatusWrapper/StatusWrapper';
import ListEmptyComponent from '@/components/atoms/common/ListEmptyComponent/ListEmptyComponent';
import TimelineLoading from '@/components/atoms/loading/TimelineLoading';
import { useHomeCommunityTimeline } from '@/hooks/custom/useHomeCommunityTimeline';

const HomeCommunityTab = () => {
	const { colorScheme } = useColorScheme();
	const { bottom } = useSafeAreaInsets();
	const listRef = useRef<FlashListRef<Patchwork.Status>>(null);
	const visibleIndexRef = useRef<number>(0);

	useEffect(() => {
		const scrollToTopListener = DeviceEventEmitter.addListener(
			'scrollToTopHomeFeed',
			() => {
				listRef.current?.scrollToOffset({ offset: 0, animated: true });
			},
		);
		return () => {
			scrollToTopListener.remove();
		};
	}, []);

	const {
		activityFlattenData,
		userInfo,
		userOriginInstance,
		isFetching,
		isRefresh,
		handleRefresh,
		onActivityLoadMore,
	} = useHomeCommunityTimeline(visibleIndexRef);

	const onViewableItemsChanged = useCallback(
		({ viewableItems }: { viewableItems: ViewToken[] }) => {
			if (viewableItems.length > 0) {
				const firstVisible = viewableItems[0].index;
				if (typeof firstVisible === 'number') {
					visibleIndexRef.current = firstVisible;
				}
			}
		},
		[],
	);

	if (activityFlattenData && activityFlattenData.length == 0 && isFetching) {
		return (
			<View className="flex-1 mt-[200px]">
				<TimelineLoading />
				<TimelineLoading />
				<TimelineLoading />
			</View>
		);
	}

	return (
		<View style={{ flex: 1 }}>
			<Tabs.FlashList
				ref={listRef}
				data={activityFlattenData}
				onViewableItemsChanged={onViewableItemsChanged}
				viewabilityConfig={{
					minimumViewTime: 100,
					itemVisiblePercentThreshold: 10,
				}}
				maintainVisibleContentPosition={{
					autoscrollToTopThreshold: 10,
				}}
				contentContainerStyle={{
					paddingBottom: bottom,
					backgroundColor:
						colorScheme === 'dark'
							? customColor['patchwork-dark-100']
							: '#ffffff',
				}}
				keyExtractor={item => item.id.toString()}
				renderItem={({ item }) => {
					if (item?.in_reply_to_id) return <></>;
					return (
						<StatusWrapper
							status={item}
							currentPage="Profile"
							statusType={item.reblog ? 'reblog' : 'normal'}
							extraPayload={
								item.reblog
									? {
											profileFeedQueryId: userInfo?.id,
											profileSource: 'own',
									  }
									: {
											domain_name: userOriginInstance,
									  }
							}
						/>
					);
				}}
				ListEmptyComponent={() => <ListEmptyComponent className="top-32" />}
				refreshControl={
					<RefreshControl
						className="mt-1"
						refreshing={isRefresh}
						tintColor={colorScheme === 'dark' ? '#fff' : '#000'}
						onRefresh={handleRefresh}
					/>
				}
				onEndReachedThreshold={0.5}
				onEndReached={onActivityLoadMore}
				showsVerticalScrollIndicator={false}
				ListFooterComponent={
					isFetching && !isRefresh ? (
						<View className="my-3 mt-5 items-center">
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
		</View>
	);
};

export default HomeCommunityTab;
