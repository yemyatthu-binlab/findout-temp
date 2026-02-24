import React from 'react';
import { FlatList, Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyListComponent } from '@/components/molecules/search/EmptyListItem/EmptyListItem';
import {
	HomeStackScreenProps,
	SearchStackScreenProps,
} from '@/types/navigation';
import customColor from '@/util/constant/color';
import { BackIcon } from '@/util/svg/icon.common';
import { useStarterPackDetail } from '@/hooks/queries/channel.queries';
import { Flow, Wander } from 'react-native-animated-spinkit';
import { StarterPackDetailHeader } from '@/components/molecules/channel/StarterPackDetailHeader/StarterPackDetailHeader';
import { useAnimatedHeader } from '@/hooks/custom/useAnimatedHeader';
import StarterPackDetailItem from '@/components/molecules/channel/StarterPackDetailItem/StarterPackDetailItem';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const StarterPackDetail: React.FC<
	HomeStackScreenProps<'StarterPackDetail'>
> = ({ route, navigation }) => {
	const { slug, title, description, collected_by, gradientColors } =
		route.params;
	const { colorScheme } = useColorScheme();
	const { top: safeAreaTop } = useSafeAreaInsets();
	const { scrollHandler, animatedHeaderStyle, animatedTitleStyle } =
		useAnimatedHeader();

	const isDark = colorScheme === 'dark';
	const solidHeaderBg = isDark ? customColor['patchwork-dark-100'] : 'white';
	const textColor = isDark ? 'white' : 'black';

	const {
		data: starterPackDetail,
		isLoading,
		refetch,
	} = useStarterPackDetail({ slug: slug });

	return (
		<View className="flex-1" style={{ backgroundColor: solidHeaderBg }}>
			{isLoading ? (
				<View className="flex-1 justify-center items-center">
					<Wander
						color={
							colorScheme == 'dark'
								? customColor['patchwork-primary-dark']
								: customColor['patchwork-primary']
						}
						size={35}
					/>
				</View>
			) : (
				<AnimatedFlatList
					data={starterPackDetail?.followers}
					ListHeaderComponent={
						<StarterPackDetailHeader
							title={title}
							description={description}
							collected_by={collected_by}
							gradientColors={gradientColors}
						/>
					}
					keyExtractor={(item, index) =>
						`${(item as Patchwork.Account)?.id ?? 'follower'}-${index}`
					}
					ListEmptyComponent={EmptyListComponent}
					renderItem={({ item }) => (
						<StarterPackDetailItem
							item={item as Patchwork.Account}
							gradientColors={gradientColors}
						/>
					)}
					contentContainerStyle={{ paddingBottom: 20 }}
					showsVerticalScrollIndicator={false}
					onScroll={scrollHandler}
					scrollEventThrottle={16}
					overScrollMode="never"
					bounces={false}
				/>
			)}

			<Animated.View
				className="absolute top-0 left-0 right-0"
				style={[
					{
						height: 100,
						paddingTop: safeAreaTop,
						backgroundColor: solidHeaderBg,
					},
					animatedHeaderStyle,
				]}
			/>

			<View
				className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-4 py-4"
				style={{ height: 100, paddingTop: safeAreaTop }}
			>
				<Pressable
					onPress={() => navigation.goBack()}
					className="w-[35] h-[35] mr-3 bg-black/30 dark:bg-white/10 rounded-full items-center justify-center active:opacity-80"
				>
					<BackIcon colorScheme={colorScheme} forceLight={true} />
				</Pressable>

				<Animated.Text
					numberOfLines={1}
					className="text-lg font-NewsCycle_Bold text-center flex-1"
					style={[{ color: textColor }, animatedTitleStyle]}
				>
					{title}
				</Animated.Text>
				<View className="w-[35]" />
			</View>
		</View>
	);
};

export default StarterPackDetail;
