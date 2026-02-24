import { useCallback, useMemo } from 'react';
import {
	Dimensions,
	Linking,
	Pressable,
	RefreshControl,
	View,
} from 'react-native';
import { CircleFade, Flow } from 'react-native-animated-spinkit';
import BackButton from '@/components/atoms/common/BackButton/BackButton';
import Header from '@/components/atoms/common/Header/Header';
import Underline from '@/components/atoms/common/Underline/Underline';
import FFAccountListItem from '@/components/organisms/profile/FFAccountListItem/FFAccountListItem';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import {
	useCheckRelationships,
	useFollowerAccountsQuery,
} from '@/hooks/queries/profile.queries';
import { useSelectedDomain } from '@/store/feed/activeDomain';
import customColor from '@/util/constant/color';
import { flattenPages } from '@/util/helper/timeline';
import { FlashList } from '@shopify/flash-list';
import AccountListEmpty from '@/components/atoms/profile/AccountListEmpty/AccountListEmpty';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '@/types/navigation';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { useAuthStore } from '@/store/auth/authStore';
import { getDomainFromAccHandle } from '@/util/helper/helper';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';

type FollowerAccountsScreenRouteProp = RouteProp<
	HomeStackParamList,
	'FollowerAccounts'
>;
const FollowerAccounts = ({
	route,
}: {
	route: FollowerAccountsScreenRouteProp;
}) => {
	const { accountId, isMainChannel, isUserFromSameServer, userAccHandle } =
		route.params;
	const domain_name = useSelectedDomain();
	const { userName, domain: userOwnDomain } =
		getDomainFromAccHandle(userAccHandle);
	const { userOriginInstance } = useAuthStore();
	const { colorScheme } = useColorScheme();
	const { t } = useTranslation();

	const {
		data,
		isFetching,
		hasNextPage,
		fetchNextPage,
		refetch,
		isLoading: isLoadingFollowerList,
	} = useFollowerAccountsQuery({
		accountId: accountId,
		domain_name: isMainChannel ? process.env.API_URL! : domain_name,
	});

	const followerIds = useMemo(() => {
		return data ? flattenPages(data).map(follower => follower.id) : [];
	}, [data]);

	// ***** Check Relationship To Other Accounts ***** //
	const {
		data: relationships,
		isLoading: isLoadingRelationships,
		refetch: refetchRelationships,
	} = useCheckRelationships({
		accountIds: followerIds,
	});
	// ***** Check Relationship To Other Accounts ***** //

	const relationshipsMap = useMemo(() => {
		if (!relationships) return new Map();
		return new Map(relationships?.map(rel => [rel.id, rel]));
	}, [relationships]);

	const renderItem = useCallback(
		({ item }: { item: Patchwork.Account }) => (
			<FFAccountListItem
				item={item}
				relationship={relationshipsMap.get(item.id)}
				isLoadingRelationships={isLoadingRelationships}
				isMainChannel={isMainChannel}
				followerIds={followerIds}
			/>
		),
		[relationshipsMap],
	);

	const handleFetchNextPage = () => {
		if (hasNextPage) {
			return fetchNextPage();
		}
	};

	return (
		<SafeScreen>
			<Header
				title={t('screen.followers')}
				leftCustomComponent={<BackButton />}
				hideUnderline
			/>
			<Underline />
			{data ? (
				<FlashList
					keyExtractor={(item, index) => `${item.id}-${index}`}
					data={flattenPages(data)}
					renderItem={renderItem}
					ItemSeparatorComponent={Underline}
					ListEmptyComponent={<AccountListEmpty />}
					onEndReachedThreshold={0.15}
					onEndReached={handleFetchNextPage}
					refreshControl={
						<RefreshControl
							refreshing={isFetching}
							tintColor={colorScheme == 'dark' ? 'white' : 'black'}
							onRefresh={() => {
								refetch();
								refetchRelationships();
							}}
						/>
					}
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
					getItemType={item => {
						return item.id;
					}}
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

			{!isLoadingFollowerList && !isUserFromSameServer && (
				<>
					<ThemeText className="text-center pt-2 text-slate-600 dark:text-slate-300">
						Followers for this profile may be missing.
					</ThemeText>
					<Pressable
						onPress={() => {
							Linking.openURL(`https://${userOwnDomain}/@${userName}`);
						}}
						className="active:opacity-70"
					>
						<ThemeText
							size={'sm_14'}
							className="text-center pb-3 text-patchwork-primary"
						>
							See more followers on {userOwnDomain}
						</ThemeText>
					</Pressable>
				</>
			)}
		</SafeScreen>
	);
};

export default FollowerAccounts;
