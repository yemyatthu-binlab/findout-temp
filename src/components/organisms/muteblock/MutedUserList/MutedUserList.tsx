import ListEmptyComponent from '@/components/atoms/common/ListEmptyComponent/ListEmptyComponent';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import MuteBlockUserItem from '@/components/atoms/muteblock/MuteBlockUserItem/MuteBlockUserItem';
import { useMuteUnmuteUserMutation } from '@/hooks/queries/feed.queries';
import { useGetMutedUserList } from '@/hooks/queries/muteblock.queries';
import { useMuteBlockCountActions } from '@/store/muteblock/muteblockCountStore';
import customColor from '@/util/constant/color';
import { flattenPages } from '@/util/helper/timeline';
import { FlashList } from '@shopify/flash-list';
import { delay } from 'lodash';
import { useColorScheme } from 'nativewind';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, RefreshControl, View } from 'react-native';
import { CircleFade, Flow } from 'react-native-animated-spinkit';

const MutedUserList = () => {
	const { t } = useTranslation();
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
		isLoading,
	} = useGetMutedUserList();
	const { colorScheme } = useColorScheme();
	const mutedAccount = useMemo(() => flattenPages(data), [data]);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const { onSetMutedAccountCount } = useMuteBlockCountActions();

	useEffect(() => {
		if (mutedAccount) {
			const currentMutedAcc =
				mutedAccount && mutedAccount.filter(account => !account.isUnMutedNow);
			onSetMutedAccountCount(currentMutedAcc?.length);
		}
	}, [mutedAccount]);

	const onMutedUserLoadMore = () => {
		if (hasNextPage) {
			return fetchNextPage();
		}
	};

	return (
		<View className="flex-1 pb-5 mt-3">
			{!isLoading ? (
				<FlashList
					data={mutedAccount}
					renderItem={({ item }) => {
						return <MuteBlockUserItem user={item} type="mute" />;
					}}
					refreshControl={
						<RefreshControl
							refreshing={isRefreshing}
							tintColor={
								colorScheme === 'dark'
									? customColor['patchwork-light-900']
									: customColor['patchwork-dark-100']
							}
							onRefresh={() => {
								setIsRefreshing(true);
								refetch();
								delay(() => setIsRefreshing(false), 1500);
							}}
						/>
					}
					ListEmptyComponent={
						<ListEmptyComponent title={t('timeline.mute_empty')} />
					}
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
					onEndReached={onMutedUserLoadMore}
				/>
			) : (
				<View className="flex-1 items-center justify-center">
					<Flow
						size={40}
						color={
							colorScheme === 'dark'
								? customColor['patchwork-primary-dark']
								: customColor['patchwork-primary']
						}
					/>
				</View>
			)}
		</View>
	);
};
export default MutedUserList;
