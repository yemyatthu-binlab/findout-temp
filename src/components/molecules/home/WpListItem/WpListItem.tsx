import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { HomeStackParamList } from '@/types/navigation';
import { cn } from '@/util/helper/twutil';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Pressable, Platform } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import he from 'he';
import { useWpStoryStore } from '@/store/feed/wpStoryStore';
import Share from 'react-native-share';
import React from 'react';
import {
	formatAuthorName,
	getAuthorList,
	truncateStr,
} from '@/util/helper/helper';
import { StatusShareIcon } from '@/util/svg/icon.status_actions';
import { isTablet } from '@/util/helper/isTablet';

export const WpListItem = ({
	post,
	isImageTakeHalfWidth = false,
}: {
	post: Patchwork.WPStory;
	isImageTakeHalfWidth?: boolean;
}) => {
	const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
	const allTerms = post._embedded?.['wp:term'];
	const authors = getAuthorList(allTerms);

	const category = allTerms?.[0]?.[0];
	const categoryName = category?.name;

	const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
	const setSelectedPost = useWpStoryStore(state => state.setSelectedPost);

	const handleSharePress = async (link: string) => {
		const options: any = Platform.select({
			ios: {
				activityItemSources: [
					{
						placeholderItem: {
							type: 'url',
							content: link,
						},
						item: {
							default: {
								type: 'url',
								content: link,
							},
						},
						linkMetadata: {
							title: 'Bristol Cable',
							icon: 'https://thebristolcable.org/wp-content/themes/bristolcable/img/bc-logo-square.svg',
						},
					},
				],
			},
			default: {
				title: 'Bristol Cable',
				subject: 'Bristol Cable',
				message: link,
			},
		});

		try {
			await Share.open(options);
		} catch (error) {
			console.log('Share cancelled or failed:');
		}
	};

	return (
		<Pressable
			className={cn(
				'flex-row mb-5 active:opacity-80',
				post.title.rendered.length > 50 ? 'items-center' : 'items-start',
			)}
			onPress={() => {
				setSelectedPost(post);
				navigation.navigate('WpStoryDetail', {
					postId: post.id,
					title: post.title.rendered,
				});
			}}
		>
			<View>
				{imageUrl ? (
					<FastImage
						source={{ uri: imageUrl, priority: FastImage.priority.high }}
						className={cn(
							'rounded-lg bg-slate-200 dark:bg-patchwork-dark-50',
							isImageTakeHalfWidth
								? isTablet
									? 'w-44 h-36'
									: 'w-[130] h-[100]'
								: isTablet
								? 'h-24 w-24'
								: 'h-16 w-16',
						)}
						resizeMode={FastImage.resizeMode.cover}
					/>
				) : (
					<View
						className={cn(
							'rounded-lg bg-gray-300',
							isImageTakeHalfWidth
								? isTablet
									? 'w-44 h-36'
									: 'w-[130] h-[100]'
								: isTablet
								? 'h-24 w-24'
								: 'h-16 w-16',
						)}
					/>
				)}
			</View>
			<View className={cn('flex-1', isTablet ? 'ml-6' : 'ml-4')}>
				<ThemeText
					className={cn(
						'font-NewsCycle_Bold',
						isTablet ? 'text-lg' : 'text-sm',
						post.title.rendered.length < 50 && (isTablet ? 'mt-3' : 'mt-2'),
					)}
					numberOfLines={isImageTakeHalfWidth ? 6 : 2}
				>
					{he.decode(post.title.rendered || '')}
				</ThemeText>
				<View
					className={cn(
						'flex-row items-center mt-1 flex-wrap',
						isTablet && 'mt-2',
					)}
				>
					{Array.isArray(authors) &&
						authors.map((author, index) => (
							<React.Fragment key={author.id}>
								<Pressable
									className="active:opacity-70"
									onPress={() =>
										navigation.navigate('AuthorDetail', {
											authorId: parseInt(author?.id),
											authorName: author?.name,
										})
									}
								>
									<ThemeText
										className={cn(
											'text-xs font-Inter_Regular text-gray-500 dark:text-gray-400 mr-0',
											isTablet && 'text-sm',
										)}
										numberOfLines={1}
									>
										{formatAuthorName(author.name)}
									</ThemeText>
								</Pressable>
								{index < authors.length - 1 && (
									<ThemeText
										className={cn(
											'text-xs font-Inter_Regular text-gray-500 dark:text-gray-400 mr-2',
											isTablet && 'text-sm',
										)}
									>
										,
									</ThemeText>
								)}
							</React.Fragment>
						))}

					{categoryName && authors.length > 0 && (
						<ThemeText
							className={cn(
								'text-xs font-Inter_Regular text-gray-500 dark:text-gray-400 mx-2',
								isTablet && 'text-sm',
							)}
						>
							.
						</ThemeText>
					)}
					{categoryName && (
						<Pressable
							className="active:opacity-70"
							onPress={() =>
								navigation.navigate('WpCategoryViewAll', {
									categoryId: parseInt(category?.id),
									title: truncateStr(categoryName, 25),
									categoryType: 'list',
								})
							}
						>
							<ThemeText
								className={cn(
									'text-xs font-Inter_Regular text-gray-500 dark:text-gray-400',
									isTablet && 'text-sm',
								)}
								numberOfLines={1}
							>
								{truncateStr(
									categoryName,
									isTablet ? 50 : isImageTakeHalfWidth ? 10 : 25,
								)}
							</ThemeText>
						</Pressable>
					)}
				</View>
			</View>
		</Pressable>
	);
};
