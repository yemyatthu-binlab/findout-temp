import React, { useEffect } from 'react';
import { View } from 'react-native';
import PollForm from '../PollForm/PollForm';
import ComposeTextInput from '@/components/atoms/compose/ComposeTextInput/ComposeTextInput';
import { LinkCard } from '@/components/atoms/compose/LinkCard/LinkCard';
import ImageCard from '@/components/atoms/compose/ImageCard/ImageCard';
import { useComposeStatus } from '@/context/composeStatusContext/composeStatus.context';
import { useManageAttachmentActions } from '@/store/compose/manageAttachments/manageAttachmentStore';
import { POLL_DURATION_OPTIONS } from '@/util/constant/pollOption';
import Graphemer from 'graphemer';
import { useMaxCount } from '@/hooks/custom/useMaxCount';
import { useFavouriteChannelLists } from '@/hooks/queries/channel.queries';
import { useEditAudienceStore } from '@/store/compose/audienceStore/editAudienceStore';
import { getQuotePolicy } from '@/util/helper/helper';

const splitter = new Graphemer();

const findClosestDuration = (expiresIn: number) => {
	return POLL_DURATION_OPTIONS.reduce((prev, curr) =>
		Math.abs(curr.value - expiresIn) < Math.abs(prev.value - expiresIn)
			? curr
			: prev,
	);
};
const EditComposeStatus = ({ status }: { status: Patchwork.Status }) => {
	const { composeState, composeDispatch } = useComposeStatus();
	const { onSelectMedia, resetAttachmentStore } = useManageAttachmentActions();
	const maxStatusLength = useMaxCount();
	const { setEditSelectedAudience, clearEditSelectedAudience } =
		useEditAudienceStore();

	const { data: newsmastChannels } = useFavouriteChannelLists(false);

	useEffect(() => {
		return () => {
			clearEditSelectedAudience();
		};
	}, []);

	useEffect(() => {
		composeDispatch({
			type: 'disableUserSuggestionsModal',
			payload: true,
		});

		if (status.text) {
			if (newsmastChannels && newsmastChannels.length > 0) {
				// Extracting all hashtags from the original status content
				const statusHashtags = new Set(
					status.text
						.split(/\s+/)
						.filter(word => word.startsWith('#'))
						.map(word => word.trim()),
				);

				const newSelectedAudience = newsmastChannels.map(channel => {
					const originalHashtags =
						channel.attributes?.patchwork_community_hashtags ?? [];
					const matchedHashtags = originalHashtags.filter(h =>
						statusHashtags.has(`#${h.hashtag}`),
					);

					if (matchedHashtags.length > 0) {
						return {
							...channel.attributes,
							patchwork_community_hashtags: matchedHashtags,
						};
					}
					return null;
				});

				setEditSelectedAudience(
					newSelectedAudience.filter(
						(
							channel,
						): channel is Patchwork.ChannelAttributes & {
							patchwork_community_hashtags: Patchwork.PatchworkCommunityHashtag[];
						} => channel !== null,
					),
				);

				// filtering newsmast hashtags from compose text
				const allAudHashtags = newsmastChannels.flatMap(
					channel =>
						channel.attributes?.patchwork_community_hashtags?.map(
							h => `#${h.hashtag}`,
						) ?? [],
				);

				const contentWithoutAudienceTags = status.text.replace(
					/#\w+/g,
					match => {
						const lower = match.toLowerCase();
						return allAudHashtags.some(tag => tag.toLowerCase() === lower)
							? ''
							: match;
					},
				);

				composeDispatch({
					type: 'text',
					payload: {
						count: splitter.countGraphemes(contentWithoutAudienceTags),
						raw: contentWithoutAudienceTags.trimEnd(),
					},
				});

				if (contentWithoutAudienceTags.length > 500) {
					composeDispatch({ type: 'maxCount', payload: maxStatusLength });
				}
			} else {
				composeDispatch({
					type: 'text',
					payload: {
						count: splitter.countGraphemes(status.text),
						raw: status.text,
					},
				});

				if (status.text.length > 500) {
					composeDispatch({ type: 'maxCount', payload: maxStatusLength });
				}
			}
		}

		if (status.poll) {
			const expiresIn = Math.floor(
				(new Date(status.poll.expires_at!).getTime() -
					new Date(status.created_at).getTime()) /
					1000,
			);
			const closestDuration = findClosestDuration(expiresIn);

			composeDispatch({
				type: 'poll',
				payload: {
					options: status.poll.options.map(option => option.title),
					expires_in: closestDuration.value,
					multiple: status.poll.multiple,
				},
			});
		}

		if (status.media_attachments.length > 0) {
			composeDispatch({
				type: 'media_add',
				payload: status.media_attachments.map(media => media.id),
			});
			onSelectMedia(
				status.media_attachments.map(media => ({
					...media,
					sensitive: status.sensitive,
				})),
			);
		}

		composeDispatch({
			type: 'visibility_change',
			payload: status.visibility as Patchwork.ComposeVisibility,
		});

		composeDispatch({
			type: 'sensitive',
			payload: status.sensitive,
		});

		composeDispatch({
			type: 'spoilerText',
			payload: status.spoiler_text || '',
		});

		composeDispatch({
			type: 'quote_policy_change',
			payload: getQuotePolicy(status),
		});

		return () => {
			composeDispatch({ type: 'clear' });
			resetAttachmentStore();
		};
	}, [status, newsmastChannels]);

	return (
		<View className="px-4">
			<ComposeTextInput />
			<PollForm composeType="create" />
			<LinkCard composeType="edit" />
			<ImageCard composeType="edit" />
		</View>
	);
};

export default EditComposeStatus;
