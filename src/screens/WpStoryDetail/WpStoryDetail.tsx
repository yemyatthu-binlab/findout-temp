import React, { useMemo, useState } from 'react';
import { View, useWindowDimensions, ScrollView } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { useColorScheme } from 'nativewind';
import he from 'he';
import moment from 'moment';
import FastImage from '@d11/react-native-fast-image';

import { useGetWordpressPostById } from '@/hooks/queries/wpFeed.queries';
import customColor from '@/util/constant/color';
import { HomeStackScreenProps } from '@/types/navigation';
import WpStoryDetailSkeleton from '@/components/atoms/loading/WpStoryDetailLoading';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import WpImageRenderer from '@/components/molecules/blog/WpImageRenderer/WpImageRenderer';
import { useWpStoryStore } from '@/store/feed/wpStoryStore';
import {
	extractMuxPlaybackId,
	extractYoutubeId,
	getAuthorList,
	cleanHtmlContent,
} from '@/util/helper/helper';
import { isTablet } from '@/util/helper/isTablet';
import { WpPlayer } from '@/components/atoms/feed/WpPlayer/WpPlayer';
import WpPodcastRenderer from '@/components/molecules/blog/WpPodcastRenderer/WpPodcastRenderer';

// Refactored imports
import WpStoryHeader from '@/components/molecules/blog/WpStoryHeader/WpStoryHeader';
import WpStoryAuthorList from '@/components/molecules/blog/WpStoryAuthorList/WpStoryAuthorList';
import { useSharePost } from '@/hooks/useSharePost';
import {
	getBaseStyle,
	getTagsStyles,
	customHTMLElementModels,
} from '@/util/constant/wpStory';

const WpStoryDetail: React.FC<HomeStackScreenProps<'WpStoryDetail'>> = ({
	route,
}) => {
	const { colorScheme } = useColorScheme();
	const { selectedPost } = useWpStoryStore();
	const { width } = useWindowDimensions();
	const { postId, title } = route.params;
	const isDark = colorScheme === 'dark';
	const solidHeaderBg = isDark ? customColor['patchwork-dark-100'] : 'white';
	const textColor = isDark ? 'white' : 'black';
	const [isMuted, setIsMuted] = useState(false);
	const { handleSharePress } = useSharePost();

	const isPostAvailableInStore = selectedPost && selectedPost.id === postId;

	const {
		data: postFromApi,
		isLoading,
		isError,
	} = useGetWordpressPostById(postId, !!postId && !isPostAvailableInStore);

	const post = isPostAvailableInStore ? selectedPost : postFromApi;

	// Use useMemo for renderers to avoid re-creation on every render
	const renderers = useMemo(
		() => ({
			iframe: (props: any) => {
				const src = props.tnode.attributes.src as string | undefined;
				const isYoutube =
					src && (src.includes('youtube.com') || src.includes('youtu.be'));

				if (isYoutube) return <></>;

				return <WpPodcastRenderer {...props} />;
			},
			img: WpImageRenderer,
		}),
		[],
	);

	if (isLoading) {
		return <WpStoryDetailSkeleton />;
	}

	if (isError || !post) {
		return (
			<View className="flex-1 items-center justify-center">
				<ThemeText>Failed to load article.</ThemeText>
			</View>
		);
	}

	const featuredImageUrl =
		post?._embedded?.['wp:featuredmedia']?.[0]?.source_url;
	const allTerms = post._embedded?.['wp:term'];
	const authors = getAuthorList(allTerms);
	const hasMuxVideo = extractMuxPlaybackId(post.content?.rendered || '');
	const youtubeId = extractYoutubeId(post.content?.rendered || '');
	const hasVideo = hasMuxVideo || youtubeId;

	const cleanedContent = cleanHtmlContent(post.content.rendered);

	return (
		<View className="flex-1" style={{ backgroundColor: solidHeaderBg }}>
			<WpStoryHeader
				title={title}
				onShare={() => handleSharePress(post.link)}
			/>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 50 }}
				bounces={false}
			>
				{hasVideo ? (
					<WpPlayer
						post={post}
						isActive={true}
						isMuted={isMuted}
						toggleMute={() => setIsMuted(prev => !prev)}
					/>
				) : (
					featuredImageUrl && (
						<FastImage
							source={{ uri: featuredImageUrl }}
							className="w-full bg-slate-200 dark:bg-patchwork-dark-50"
							style={{ height: isTablet ? 450 : 300 }}
						/>
					)
				)}

				<View className="px-4 pt-6">
					<ThemeText
						className={
							isTablet
								? 'text-3xl font-NewsCycle_Bold leading-[40px] mb-6'
								: 'text-2xl font-NewsCycle_Bold leading-9 mb-4'
						}
					>
						{he.decode(post.title.rendered || '')}
					</ThemeText>

					<ThemeText
						className={
							isTablet
								? 'text-lg mb-6 text-gray-500'
								: 'text-base mb-4 text-gray-500'
						}
					>
						{moment(post.date).format('MMMM DD, YYYY')}
					</ThemeText>

					<WpStoryAuthorList authors={authors} />

					<RenderHTML
						contentWidth={width - 32}
						source={{ html: cleanedContent }}
						baseStyle={getBaseStyle({ isTablet, textColor })}
						tagsStyles={getTagsStyles({ isDark, isTablet, textColor }) as any}
						customHTMLElementModels={customHTMLElementModels}
						renderers={renderers}
						defaultTextProps={{ style: { fontFamily: 'Inter-Regular' } }}
						ignoredStyles={['backgroundColor', 'color']}
						systemFonts={['Inter-Regular', 'Inter-Bold', 'NewsCycle-Bold']}
					/>
				</View>
			</ScrollView>
		</View>
	);
};

export default WpStoryDetail;
