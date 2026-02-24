import BackButton from '@/components/atoms/common/BackButton/BackButton';
import Header from '@/components/atoms/common/Header/Header';
import ListEmptyComponent from '@/components/atoms/common/ListEmptyComponent/ListEmptyComponent';
import Underline from '@/components/atoms/common/Underline/Underline';
import AccountAvatar from '@/components/molecules/feed/AccountAvatar/AccountAvatar';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import { useGetSuggestedPeople } from '@/hooks/queries/profile.queries';
import { HomeStackScreenProps } from '@/types/navigation';
import customColor from '@/util/constant/color';
import { flattenPages } from '@/util/helper/timeline';
import { FlashList } from '@shopify/flash-list';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { Dimensions, RefreshControl, View } from 'react-native';
import { CircleFade, Flow } from 'react-native-animated-spinkit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TrendingStatuses: React.FC<HomeStackScreenProps<'TrendingStatuses'>> = ({
	route,
	navigation,
}) => {
	const { bottom } = useSafeAreaInsets();
	const { colorScheme } = useColorScheme();
	const { t } = useTranslation();

	const {
		data: suggestedPeople,
		isFetching,
		refetch: refetchSuggestedPeople,
	} = useGetSuggestedPeople({ limit: 20 });

	return (
		<SafeScreen>
			<Header
				title={t('screen.suggested_people')}
				leftCustomComponent={
					<BackButton
						customOnPress={() => {
							navigation.goBack();
						}}
					/>
				}
				hideUnderline
			/>
			<Underline />
			{suggestedPeople ? (
				<FlashList
					data={suggestedPeople}
					keyExtractor={item => item.account.id.toString()}
					contentContainerStyle={{
						paddingBottom: bottom,
						backgroundColor:
							colorScheme === 'dark'
								? customColor['patchwork-dark-100']
								: '#ffffff',
					}}
					renderItem={({ item }) => (
						<AccountAvatar
							account={item.account}
							size={'md'}
							className="w-full mt-4"
							onPress={() =>
								navigation.navigate('ProfileOther', {
									id: item.account.id,
								})
							}
						/>
					)}
					ListEmptyComponent={() => (
						<ListEmptyComponent title={t('search.no_suggestion_found')} />
					)}
					refreshControl={
						<RefreshControl
							refreshing={isFetching}
							tintColor={colorScheme == 'dark' ? 'white' : 'black'}
							onRefresh={refetchSuggestedPeople}
						/>
					}
					showsVerticalScrollIndicator={false}
					numColumns={3}
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

export default TrendingStatuses;
