import { useMemo } from 'react';
import { ElementType, parseDocument } from 'htmlparser2';
import { Platform, Pressable, View } from 'react-native';
import { ThemeText } from '../ThemeText/ThemeText';
import { useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '@/types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelectedDomain } from '@/store/feed/activeDomain';
import { layoutAnimation } from '@/util/helper/timeline';
import { useAuthStore } from '@/store/auth/authStore';
import { useStatusContext } from '@/context/statusItemContext/statusItemContext';
import { useActiveFeedAction } from '@/store/feed/activeFeed';
import { updateShowAllLongPostCache } from '@/util/cache/feed/feedCache';
import { useTranslation } from 'react-i18next';
import { useHtmlRenderer } from '@/hooks/custom/useHtmlRenderer';
import { ChildNode } from 'domhandler';

type Props = {
	status: Patchwork.Status;
	numberOfLines?: number;
	isMainStatus?: boolean;
	isFromNoti?: boolean;
	continuedTagNames?: string[];
	isFromQuoteCompose?: boolean;
};

const MAX_ALLOWED_LINES = 35;

const ParseHtml = ({
	status,
	numberOfLines = 10,
	isMainStatus,
	isFromNoti,
	continuedTagNames,
	isFromQuoteCompose = false,
}: Props) => {
	const { t } = useTranslation();
	const domain_name = useSelectedDomain();
	const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
	const { userInfo } = useAuthStore();
	const { currentPage } = useStatusContext();
	const { setActiveFeed } = useActiveFeedAction();
	const isFeedDetail = currentPage === 'FeedDetail';
	const isLongPost = !!status?.custom?.isLongPost;

	const document = useMemo(() => {
		return status.translated_text
			? parseDocument(status.translated_text)
			: parseDocument(status.content);
	}, [status.content, status.translated_text]);

	const handleHashTagPress = (tag: string) => {
		if (isFromQuoteCompose) return;
		const specialTag = tag.replace(/#/g, '').toLowerCase();
		const routes = navigation.getState()?.routes || [];
		const currentRoute = routes[routes.length - 1];

		const params = currentRoute?.params as { hashtag?: string } | undefined;

		if (
			currentRoute?.name === 'HashTagDetail' &&
			params?.hashtag === specialTag
		) {
			return;
		}

		if (currentRoute?.name === 'HashTagDetail') {
			navigation.push('HashTagDetail', {
				hashtag: specialTag,
				hashtagDomain: domain_name,
			});
		} else {
			navigation.navigate('HashTagDetail', {
				hashtag: specialTag,
				hashtagDomain: domain_name,
			});
		}
	};

	const handleMentionPress = (mention: Patchwork.Mention) => {
		if (isFromQuoteCompose) return;
		if (mention.id === userInfo?.id!) {
			navigation.navigate('Profile', { id: userInfo?.id! });
		} else {
			navigation.navigate('ProfileOther', {
				id: mention.id,
			});
		}
	};

	const navigateToWebView = (url: string) => {
		if (isFromQuoteCompose) return;
		navigation.navigate('WebViewer', { url });
	};

	const handleSeeMorePress = () => {
		if (isFromQuoteCompose) return;
		setActiveFeed(status);
		navigation.push('FeedDetail', {
			id: status.id,
		});
	};

	const { renderNode, adaptedLineheight } = useHtmlRenderer({
		status,
		documentChildren: document.children,
		isMainStatus,
		continuedTagNames,
		onHashtagPress: handleHashTagPress,
		onMentionPress: handleMentionPress,
		onLinkPress: navigateToWebView,
	});

	const handleLayout = ({ nativeEvent }: any) => {
		if (nativeEvent.lines.length >= numberOfLines + 8) {
			updateShowAllLongPostCache(status.reblog ? status.reblog : status);
		}
	};

	return (
		<View style={{ overflow: 'hidden', paddingTop: 4 }}>
			<ThemeText
				children={document.children.map((node, index) =>
					renderNode(node, index),
				)}
				onTextLayout={handleLayout}
				style={{
					lineHeight: adaptedLineheight,
				}}
				numberOfLines={
					isLongPost
						? isFeedDetail
							? 999
							: numberOfLines
						: Math.max(MAX_ALLOWED_LINES, numberOfLines)
				}
			/>
			{!isFeedDetail && isLongPost && !isFromNoti ? (
				<Pressable
					onPress={() => {
						if (Platform.OS !== 'ios') {
							layoutAnimation();
						}
						handleSeeMorePress();
					}}
				>
					<ThemeText
						className="underline text-patchwork-primary dark:text-patchwork-soft-primary"
						children={t('common.see_more')}
					/>
				</Pressable>
			) : null}
		</View>
	);
};

export default ParseHtml;
