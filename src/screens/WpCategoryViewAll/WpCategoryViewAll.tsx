import { View } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '@/types/navigation';
import { useGetWordpressPostsByCategoryPaginated } from '@/hooks/queries/wpFeed.queries';
import { FlashList } from '@shopify/flash-list';
import { WpListItem } from '@/components/molecules/home/WpListItem/WpListItem';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import customColor from '@/util/constant/color';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import BackButton from '@/components/atoms/common/BackButton/BackButton';
import Header from '@/components/atoms/common/Header/Header';
import { Circle, Wander } from 'react-native-animated-spinkit';
import { useColorScheme } from 'nativewind';

type WpCategoryViewAllScreenRouteProp = RouteProp<
	HomeStackParamList,
	'WpCategoryViewAll'
>;

const WpCategoryViewAll = () => {
	const route = useRoute<WpCategoryViewAllScreenRouteProp>();
	const { colorScheme } = useColorScheme();
	const { categoryId, title } = route.params;

	const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
		useGetWordpressPostsByCategoryPaginated(categoryId);

	const posts = data?.pages.flatMap(page => page.posts) ?? [];

	const handleEndReached = () => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	};

	const ListFooter = () => {
		if (!isFetchingNextPage) return null;
		return (
			<View className="items-center justify-center p-4">
				<Circle
					size={20}
					color={
						colorScheme === 'dark'
							? customColor['patchwork-primary-dark']
							: customColor['patchwork-primary']
					}
				/>
			</View>
		);
	};

	return (
		<SafeScreen>
			<Header title={title} leftCustomComponent={<BackButton />} />
			<View className="flex-1">
				{isLoading && !data ? (
					<View className="items-center justify-center flex-1 mb-10">
						<Wander
							size={30}
							color={
								colorScheme === 'dark'
									? customColor['patchwork-primary-dark']
									: customColor['patchwork-primary']
							}
						/>
					</View>
				) : (
					<FlashList
						data={posts}
						renderItem={({ item }) => {
							return <WpListItem post={item} isImageTakeHalfWidth />;
						}}
						keyExtractor={item => item.id.toString()}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{
							paddingHorizontal: 16,
							paddingVertical: 16,
						}}
						ItemSeparatorComponent={() => {
							return <View className={'mt-2'} />;
						}}
						onEndReached={handleEndReached}
						onEndReachedThreshold={0.5}
						ListFooterComponent={ListFooter}
						ListEmptyComponent={() => {
							return (
								<View className="items-center justify-center flex-1 mt-10">
									<ThemeText>No stories found in this category.</ThemeText>
								</View>
							);
						}}
					/>
				)}
			</View>
		</SafeScreen>
	);
};

export default WpCategoryViewAll;
