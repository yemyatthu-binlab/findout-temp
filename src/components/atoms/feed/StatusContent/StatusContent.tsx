import { Pressable, View, ViewProps } from 'react-native';
import StatusImage from '../StatusImage/StatusImage';
import RssContentCard from '../RssContentCard/RssContentCard';
import NotiStatusImageView from '../../notifications/NotiStatusImageView/NotiStatusImageView';
import { useActiveFeedAction } from '@/store/feed/activeFeed';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '@/types/navigation';
import PollVotingStatus from '@/components/organisms/poll/PollVotingStatus/PollVotingStatus';
import { useStatusContext } from '@/context/statusItemContext/statusItemContext';
import usePreloadUserRelationship from '@/hooks/custom/usePreloadUserRelationship';
import StatusVideo from '../StatusVideo/StatusVideo';
import { getComeFromByPage } from '@/util/helper/feed';
import StatusTags from '../StatusTags/StatusTags';
import GifImageText from '../GifImageText/GifImageText';
import ParseHtml from '../../common/ParseHtml/ParseHtml';
import { useMemo } from 'react';
import { getContinuedHashtags } from '@/util/helper/hashtags';
import { isTablet } from '@/util/helper/isTablet';
import { isSinglePortraitImage } from '@/util/helper/statusImageHelpers';
import SpoilerWarning from '../SpoilerWarning/SpoilerWarning';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import { toggleForceShowSpoilerTextCache } from '@/util/cache/feed/feedCache';
import { useTranslation } from 'react-i18next';
import { FALLBACK_PREVIEW_IMAGE_URL } from '@/util/constant';

type Props = {
	status: Patchwork.Status;
	isFromNotiStatusImage?: boolean;
	isReposting?: boolean;
	isMainChannel?: boolean;
	isPinPost?: boolean;
	isFromQuoteCompose?: boolean;
} & ViewProps;

const StatusContent = ({
	status,
	isFromNotiStatusImage,
	isReposting,
	isMainChannel,
	isPinPost = false,
	isFromQuoteCompose = false,
}: Props) => {
	const { t } = useTranslation();
	const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
	const isImageMissing = status?.media_attachments?.length !== 0;
	const { setActiveFeed, setFeedDetailExtraPayload } = useActiveFeedAction();
	const { currentPage, extraPayload, statusType } = useStatusContext();
	const isVideoInclude =
		status?.media_attachments.length > 0 &&
		status?.media_attachments?.some(
			attachment => attachment.type === 'video' || attachment.type === 'gifv',
		);
	const isGifStatus =
		status?.media_attachments.length > 0 &&
		status?.media_attachments?.some(attachment => attachment.type === 'gifv');

	const continuedTagNames = useMemo(() => {
		if (status.tags?.length > 0) {
			return getContinuedHashtags(status.content || '');
		}
		return [];
	}, [status.content, status.tags]);

	const hasSpoiler = !!status.spoiler_text;
	const isContentExpanded = status.custom?.forceShowSensitiveContent;
	const showActualContent = !hasSpoiler || isContentExpanded;

	usePreloadUserRelationship(
		status,
		currentPage == 'FeedDetail' && statusType == 'feedDetail',
	);

	const handlePressStatus = () => {
		if (currentPage == 'FeedDetail' && statusType == 'feedDetail') return;
		setActiveFeed(status.reblog ? status.reblog : status);
		const comeFrom = getComeFromByPage(currentPage);

		if (comeFrom) {
			setFeedDetailExtraPayload({
				comeFrom: comeFrom,
			});
		}
		if (extraPayload) {
			setFeedDetailExtraPayload({
				comeFrom: comeFrom!,
				carriedPayload: extraPayload,
			});
		}
		if (extraPayload?.profileSource && extraPayload.profileFeedQueryId) {
			setFeedDetailExtraPayload({
				comeFrom: extraPayload.profileSource == 'own' ? 'profile' : 'other',
				carriedPayload: extraPayload,
			});
		}

		if (isFromNotiStatusImage && status.visibility == 'direct') {
			navigation.navigate('Conversations', {
				screen: 'ConversationDetail',
				params: { id: status.id, isFromExternalNotiAlert: true },
			});
		} else {
			navigation.push('FeedDetail', {
				id: status.reblog ? status.reblog.id : status.id,
				isMainChannel: isMainChannel,
			});
		}
	};

	return (
		<View>
			<Pressable onPress={handlePressStatus} disabled={isReposting}>
				{hasSpoiler && !isContentExpanded && <SpoilerWarning status={status} />}

				{showActualContent && (
					<>
						{hasSpoiler && (
							<View className="bg-patchwork-primary/10 border border-patchwork-primary/50 p-2 rounded-lg mb-2 flex-row items-center justify-between">
								<ThemeText
									className="text-patchwork-primary dark:text-white  text-xs flex-1 mr-2 italic"
									numberOfLines={1}
								>
									{status.spoiler_text}
								</ThemeText>
								<Pressable
									onPress={() => toggleForceShowSpoilerTextCache(status, false)}
									className="bg-patchwork-primary/20 px-3 py-1.5 rounded active:opacity-70"
								>
									<ThemeText className="text-patchwork-primary dark:text-white text-xs font-bold">
										{t('compose.hide_post')}
									</ThemeText>
								</Pressable>
							</View>
						)}
						<ParseHtml
							status={status}
							isFromNoti={isFromNotiStatusImage}
							numberOfLines={isFromNotiStatusImage ? 3 : 10}
							continuedTagNames={continuedTagNames}
							isFromQuoteCompose={isFromQuoteCompose}
						/>
						{status?.poll && (
							<PollVotingStatus
								isFromNoti={isFromNotiStatusImage}
								status={status}
								isReposting={isReposting}
							/>
						)}
						{status.media_attachments?.length > 0 &&
							isVideoInclude &&
							currentPage !== 'Notification' && <StatusVideo status={status} />}

						{isGifStatus && currentPage === 'Notification' && <GifImageText />}

						{!status?.is_rss_content &&
							status?.media_attachments?.length >= 1 &&
							!isVideoInclude &&
							(!isFromNotiStatusImage ? (
								<View
									className={
										isTablet && isSinglePortraitImage(status.media_attachments)
											? 'h-[760px] mt-3'
											: isTablet
											? 'h-[400px] mt-3'
											: isSinglePortraitImage(status.media_attachments)
											? 'h-[371.2px] mt-1'
											: 'h-[232px] mt-1'
									}
								>
									<StatusImage
										statusId={status?.id}
										media_attachments={status?.media_attachments}
										sensitive={status?.sensitive}
										isPinPost={isPinPost}
										isFromQuoteCompose={isFromQuoteCompose}
									/>
								</View>
							) : (
								<NotiStatusImageView {...{ status }} />
							))}
						{!isGifStatus && isFromNotiStatusImage && isVideoInclude && (
							<NotiStatusImageView {...{ status }} />
						)}
						{status?.is_rss_content && status?.card && (
							<RssContentCard
								meta={{
									...{
										meta: status?.card,
									},
								}}
							/>
						)}
						{!isImageMissing && !status?.is_rss_content && status?.card && (
							<View>
								<RssContentCard
									{...{
										meta: {
											image: status?.card?.image || FALLBACK_PREVIEW_IMAGE_URL,
											title: status?.card?.title,
											url: status?.card?.url,
											blurhash: status?.card?.blurhash,
										},
									}}
									isFromQuoteCompose={isFromQuoteCompose}
									extraStyle="mt-3"
								/>
							</View>
						)}

						{continuedTagNames?.length > 0 && (
							<StatusTags
								status={status}
								continuedTagNames={continuedTagNames}
								isFromQuoteCompose={isFromQuoteCompose}
							/>
						)}
					</>
				)}
			</Pressable>
		</View>
	);
};

export default StatusContent;
