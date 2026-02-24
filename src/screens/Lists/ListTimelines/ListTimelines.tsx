import { View, Dimensions, RefreshControl } from 'react-native';
import { CircleFade, Flow } from 'react-native-animated-spinkit';
import BackButton from '@/components/atoms/common/BackButton/BackButton';
import Header from '@/components/atoms/common/Header/Header';
import ListEmptyComponent from '@/components/atoms/common/ListEmptyComponent/ListEmptyComponent';
import StatusWrapper from '@/components/organisms/feed/StatusWrapper/StatusWrapper';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import { useGetListTimelines } from '@/hooks/queries/lists.queries';
import {
	ListTimelinesScreenNavigationProp,
	ListTimelinesScreenRouteProp,
} from '@/types/navigation';
import customColor from '@/util/constant/color';
import { flattenPages } from '@/util/helper/timeline';
import { FlashList } from '@shopify/flash-list';
import ListSettings from '@/components/molecules/lists/ListSettings';
import { useCallback, useState } from 'react';
import { queryClient } from '@/App';
import { ListTimelinesQueryKey } from '@/types/queries/lists.type';
import { useFocusEffect } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';

const ListTimelines = ({
	navigation,
	route,
}: {
	navigation: ListTimelinesScreenNavigationProp;
	route: ListTimelinesScreenRouteProp;
}) => {
	const { t } = useTranslation();
	const { colorScheme } = useColorScheme();
	const { id, title } = route.params;
	const [isRefresh, setIsRefresh] = useState(false);
	const queryKey: ListTimelinesQueryKey = ['list-timelines', { id }];

	const {
		data: listTimelines,
		isLoading,
		isFetching,
		hasNextPage,
		refetch,
		fetchNextPage,
	} = useGetListTimelines({
		id,
	});

	const handleRefresh = async () => {
		setIsRefresh(true);
		refetch();
		setIsRefresh(false);
	};

	const onTimelineContentLoadMore = () => {
		if (hasNextPage) {
			return fetchNextPage();
		}
	};

	useFocusEffect(
		useCallback(() => {
			queryClient.invalidateQueries({ queryKey });
		}, []),
	);

	return (
		<SafeScreen>
			<Header
				title={title}
				leftCustomComponent={<BackButton />}
				underlineClassName="mb-0"
				rightCustomComponent={<ListSettings {...{ navigation, id, title }} />}
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
				<FlashList
					data={flattenPages(listTimelines)}
					renderItem={({ item }) => (
						<StatusWrapper
							status={item}
							currentPage="Lists"
							statusType={item.reblog ? 'reblog' : 'normal'}
							extraPayload={{ listTimelinesId: id }}
						/>
					)}
					refreshControl={
						<RefreshControl
							className="mt-1"
							refreshing={isRefresh}
							tintColor={
								colorScheme === 'dark'
									? customColor['patchwork-light-900']
									: customColor['patchwork-dark-100']
							}
							onRefresh={handleRefresh}
						/>
					}
					ListEmptyComponent={() => {
						return (
							<ListEmptyComponent subtitle={t('list.list_empty_subtitle')} />
						);
					}}
					onEndReachedThreshold={0.15}
					onEndReached={onTimelineContentLoadMore}
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
					showsVerticalScrollIndicator={false}
				/>
			)}
		</SafeScreen>
	);
};

export default ListTimelines;
