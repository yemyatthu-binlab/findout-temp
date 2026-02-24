import { View, Dimensions, Platform } from 'react-native';
import { useMemo, useState } from 'react';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import { useAuthStore } from '@/store/auth/authStore';
import { useGetHomeTimeline } from '@/hooks/queries/channel.queries';
import { useSelectedDomain } from '@/store/feed/activeDomain';
import { flattenPages } from '@/util/helper/timeline';
import StatusWrapper from '@/components/organisms/feed/StatusWrapper/StatusWrapper';
import { RefreshControl } from 'react-native-gesture-handler';
import customColor from '@/util/constant/color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import ListEmptyComponent from '@/components/atoms/common/ListEmptyComponent/ListEmptyComponent';
import { CircleFade, Flow } from 'react-native-animated-spinkit';
import {
	MaterialTabBar,
	MaterialTabItem,
	Tabs,
} from 'react-native-collapsible-tab-view';
import useAppropiateColorHash from '@/hooks/custom/useAppropiateColorHash';
import { useFollowingAccountsQuery } from '@/hooks/queries/profile.queries';
import AccountAvatar from '@/components/molecules/feed/AccountAvatar/AccountAvatar';
import { HomeStackScreenProps } from '@/types/navigation';
import { isTablet } from '@/util/helper/isTablet';
import { useTranslation } from 'react-i18next';
import BackButton from '@/components/atoms/common/BackButton/BackButton';
import Header from '@/components/atoms/common/Header/Header';
import { useTabBarTheme } from '@/hooks/custom/useTabBarTheme';

const PeopleFollowing = ({
	navigation,
	route,
}: HomeStackScreenProps<'PeopleFollowing'>) => {
	const { t, i18n } = useTranslation();
	const { userInfo } = useAuthStore();
	const domain_name = useSelectedDomain();
	const { bottom } = useSafeAreaInsets();
	const { colorScheme } = useColorScheme();
	const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
	const { barColor, tabBarTextColor } = useTabBarTheme();

	const [isPeopleFollowingRefresh, setIsPeopleFollowingRefresh] =
		useState(false);
	const [isActivityRefresh, setIsActivityRefresh] = useState(false);
	const isBurmese = i18n.language === 'my';

	const {
		data: peopleFollowing,
		hasNextPage: hasPeopleFollowingNextPage,
		fetchNextPage: fetchPeopleFollowingNextPage,
		isFetching: isPeopleFollowingFetching,
		isLoading: isPeopleFollowingLoading,
		refetch: refetchPeopleFollowing,
	} = useFollowingAccountsQuery({
		accountId: userInfo?.id!,
		domain_name: domain_name,
	});

	const {
		data: activity,
		hasNextPage: hasActivityNextPage,
		fetchNextPage: fetchActivityNextPage,
		isFetching: isActivityFetching,
		isLoading: isActivityLoading,
		refetch: refetchActivity,
	} = useGetHomeTimeline({
		domain_name,
		remote: false,
		only_media: false,
	});

	const activityFlattenData = useMemo(() => flattenPages(activity), [activity]);
	const peopleFollowingFlattenData = useMemo(
		() => flattenPages(peopleFollowing),
		[peopleFollowing],
	);

	const onPeopleFollowingLoadMore = () => {
		if (hasPeopleFollowingNextPage) {
			return fetchPeopleFollowingNextPage();
		}
	};

	const onActivityLoadMore = () => {
		if (hasActivityNextPage) {
			return fetchActivityNextPage();
		}
	};

	const handlePeopleFollowingRefresh = async () => {
		setIsPeopleFollowingRefresh(true);
		refetchPeopleFollowing();
		setIsPeopleFollowingRefresh(false);
	};

	const handleActivityRefresh = async () => {
		setIsActivityRefresh(true);
		refetchActivity();
		setIsActivityRefresh(false);
	};

	return (
		<SafeScreen>
			<Header
				title={t('screen.following')}
				leftCustomComponent={<BackButton />}
			/>
			{isActivityLoading || isPeopleFollowingLoading ? (
				<View className="flex-1 items-center justify-center">
					<Flow
						size={30}
						color={
							colorScheme === 'dark'
								? customColor['patchwork-primary-dark']
								: customColor['patchwork-primary']
						}
					/>
				</View>
			) : (
				<Tabs.Container
					// tabBarHeight={500}
					initialTabName="Activity"
					containerStyle={{ flex: 1 }}
					headerContainerStyle={{
						elevation: 0,
						shadowOpacity: 0,
						shadowColor: 'transparent',
					}}
					renderTabBar={props => {
						return (
							<MaterialTabBar
								keepActiveTabCentered
								{...props}
								indicatorStyle={{
									backgroundColor: tabBarTextColor,
									...(isTablet
										? {
												maxWidth: windowWidth * 0.375, //3/8
												marginLeft: windowWidth * 0.0625, // 1/16
										  }
										: { maxWidth: 180, marginHorizontal: 12 }),
								}}
								style={{
									backgroundColor: barColor,
								}}
								TabItemComponent={props => (
									<MaterialTabItem
										{...props}
										labelStyle={{
											lineHeight: isBurmese ? 32 : undefined,
											...((props.labelStyle ?? {}) as object),
										}}
										pressColor="#fff0"
										label={props.label}
										android_ripple={{
											color: '#fff0',
										}}
									/>
								)}
								activeColor={tabBarTextColor}
								labelStyle={{
									fontFamily: 'NewsCycle-Bold',
									textTransform: 'capitalize',
									fontSize: 15,
								}}
								inactiveColor={customColor['patchwork-grey-400']}
							/>
						);
					}}
				>
					<Tabs.Tab label={t('timeline.activity')} name="Activity">
						<Tabs.FlashList
							data={activityFlattenData}
							contentContainerStyle={{
								paddingBottom: bottom,
								backgroundColor:
									colorScheme === 'dark'
										? customColor['patchwork-dark-100']
										: '#ffffff',
							}}
							keyExtractor={item => item.id.toString()}
							renderItem={({ item }) => {
								return (
									<>
										<StatusWrapper
											status={item}
											currentPage="HomeTimeline"
											statusType={item.reblog ? 'reblog' : 'normal'}
											extraPayload={{ domain_name }}
											comeFrom="homeTimeline"
										/>
									</>
								);
							}}
							ListEmptyComponent={() => (
								<ListEmptyComponent
									title={t('common.no_statuses_found')}
									className="mt-10"
								/>
							)}
							refreshControl={
								<RefreshControl
									className="mt-1"
									refreshing={isActivityRefresh}
									tintColor={colorScheme == 'dark' ? 'white' : 'black'}
									onRefresh={handleActivityRefresh}
								/>
							}
							onEndReachedThreshold={0.15}
							onEndReached={onActivityLoadMore}
							showsVerticalScrollIndicator={false}
							ListFooterComponent={
								isActivityFetching ? (
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
					</Tabs.Tab>
					<Tabs.Tab label={t('timeline.people')} name="People">
						<Tabs.FlashList
							data={peopleFollowingFlattenData}
							contentContainerStyle={{
								paddingBottom: bottom,
								paddingTop: Platform.OS === 'ios' ? bottom - 30 : bottom + 50,
								backgroundColor:
									colorScheme === 'dark'
										? customColor['patchwork-dark-100']
										: '#ffffff',
							}}
							keyExtractor={item => item.id.toString()}
							renderItem={({ item }) => (
								<AccountAvatar
									className="w-full mt-4"
									account={item}
									size={'md'}
									onPress={() =>
										navigation.navigate('ProfileOther', { id: item.id })
									}
								/>
							)}
							ListEmptyComponent={() => (
								<ListEmptyComponent className="mt-10" />
							)}
							refreshControl={
								<RefreshControl
									className="mt-1"
									refreshing={isPeopleFollowingRefresh}
									tintColor={colorScheme == 'dark' ? 'white' : 'black'}
									onRefresh={handlePeopleFollowingRefresh}
								/>
							}
							onEndReachedThreshold={0.15}
							onEndReached={onPeopleFollowingLoadMore}
							showsVerticalScrollIndicator={false}
							numColumns={isTablet ? 5 : 3}
							ListFooterComponent={
								isPeopleFollowingFetching ? (
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
					</Tabs.Tab>
				</Tabs.Container>
			)}
		</SafeScreen>
	);
};

export default PeopleFollowing;
