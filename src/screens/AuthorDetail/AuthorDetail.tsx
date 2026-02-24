import React from 'react';
import { View, FlatList, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import he from 'he';
import Animated, {
	useSharedValue,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	interpolate,
	Extrapolation,
} from 'react-native-reanimated';
import {
	useGetWordpressAuthorById,
	useGetWordpressAuthorExtras,
	useGetWordpressPostsByAuthorIdPaginated,
} from '@/hooks/queries/wpFeed.queries';
import { HomeStackParamList, HomeStackScreenProps } from '@/types/navigation';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import Image from '@/components/atoms/common/Image/Image';
import customColor from '@/util/constant/color';
import WpDefaultAvatar from '@/components/molecules/blog/WpDefaultAvatar/WpDefaultAvatar';
import { WpstoryCard } from '@/components/molecules/home/WpStoryCard/WpStoryCard';
import BackButton from '@/components/atoms/common/BackButton/BackButton';
import { Circle, Fold, Wander } from 'react-native-animated-spinkit';
import { BackIcon } from '@/util/svg/icon.common';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { formatAuthorName, formatAuthorSlug } from '@/util/helper/helper';
import WpAuthorDetailHeader from '@/components/molecules/blog/WpAuthorDetailHeader/WpAuthorDetailHeader';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const HEADER_CONTENT_HEIGHT = 140;
const HEADER_TRANSITION_POINT = HEADER_CONTENT_HEIGHT - 50;

const AuthorDetail: React.FC<HomeStackScreenProps<'AuthorDetail'>> = ({
	route,
}) => {
	const { colorScheme } = useColorScheme();
	const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
	const { top: safeAreaTop } = useSafeAreaInsets();
	const { authorId, authorName } = route.params;

	const scrollY = useSharedValue(0);
	const scrollHandler = useAnimatedScrollHandler({
		onScroll: event => {
			scrollY.value = event.contentOffset.y;
		},
	});

	const isDark = colorScheme === 'dark';
	const metaColor = isDark
		? customColor['patchwork-light-900']
		: customColor['patchwork-dark-400'];
	const solidHeaderBg = isDark ? customColor['patchwork-dark-100'] : 'white';
	const textColor = isDark ? 'white' : 'black';

	const { data: author, isLoading: isLoadingAuthor } =
		useGetWordpressAuthorById(authorId);

	const { data: authorExtras, isLoading: isLoadingAvatarInfo } =
		useGetWordpressAuthorExtras(formatAuthorSlug(authorName));

	const {
		data: postsData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading: isLoadingPosts,
	} = useGetWordpressPostsByAuthorIdPaginated(authorId);

	const posts = postsData?.pages.flatMap(page => page.posts) ?? [];
	const authorAvatarUrl = authorExtras?.imageUrl || author?.avatar_urls?.['96'];
	const authorDescription = authorExtras?.description || author?.description;

	const animatedHeaderStyle = useAnimatedStyle(() => {
		const opacity = interpolate(
			scrollY.value,
			[HEADER_TRANSITION_POINT, HEADER_TRANSITION_POINT + 40],
			[0, 1],
			Extrapolation.CLAMP,
		);
		return { opacity };
	});

	const animatedTitleStyle = useAnimatedStyle(() => {
		const opacity = interpolate(
			scrollY.value,
			[HEADER_TRANSITION_POINT + 10, HEADER_TRANSITION_POINT + 50],
			[0, 1],
			Extrapolation.CLAMP,
		);
		return { opacity };
	});

	const renderHeader = () => (
		<WpAuthorDetailHeader
			author={author}
			authorAvatarUrl={authorAvatarUrl}
			authorDescription={authorDescription}
			isLoadingAuthor={isLoadingAuthor}
			isLoadingAvatarInfo={isLoadingAvatarInfo}
			safeAreaTop={safeAreaTop}
			isDark={isDark}
			metaColor={metaColor}
			solidHeaderBg={solidHeaderBg}
		/>
	);

	const renderFooter = () => {
		if (!isFetchingNextPage) return null;
		return (
			<View className="items-center justify-center my-4">
				<Circle
					size={25}
					color={
						isDark
							? customColor['patchwork-primary-dark']
							: customColor['patchwork-primary']
					}
				/>
			</View>
		);
	};

	if (isLoadingPosts && !postsData) {
		return (
			<View className="flex-1 items-center justify-center bg-white dark:bg-black">
				<View
					className="absolute left-4 z-10 bg-black/50 dark:bg-white/10 rounded-full"
					style={{ top: safeAreaTop + 10 }}
				>
					<BackButton forceLight />
				</View>
				<Wander
					size={30}
					color={
						isDark
							? customColor['patchwork-primary-dark']
							: customColor['patchwork-primary']
					}
				/>
			</View>
		);
	}

	return (
		<View className="flex-1" style={{ backgroundColor: solidHeaderBg }}>
			<AnimatedFlatList
				data={posts}
				overScrollMode="never"
				bounces={false}
				renderItem={({ item }) => (
					<View className="px-4">
						<WpstoryCard post={item as Patchwork.WPStory} isFullWidth />
					</View>
				)}
				onScroll={scrollHandler}
				scrollEventThrottle={16}
				ItemSeparatorComponent={() => <View className="mt-10" />}
				ListHeaderComponent={renderHeader}
				ListFooterComponent={renderFooter}
				onEndReached={() => {
					if (hasNextPage && !isFetchingNextPage) {
						fetchNextPage();
					}
				}}
				onEndReachedThreshold={0.5}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 20 }}
			/>

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
					className="w-[35] h-[35] mr-3 bg-black/30 rounded-full items-center justify-center active:opacity-80"
				>
					<BackIcon colorScheme={colorScheme} forceLight={true} />
				</Pressable>
				<Animated.Text
					numberOfLines={1}
					className="text-lg font-NewsCycle_Bold text-center"
					style={[{ color: textColor }, animatedTitleStyle]}
				>
					{he.decode(formatAuthorName(author?.name || ''))}
				</Animated.Text>
				<View className="w-[35]" />
			</View>
		</View>
	);
};

export default AuthorDetail;
