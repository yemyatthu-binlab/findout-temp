import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import FastImage from '@d11/react-native-fast-image';
import { scale } from 'react-native-size-matters';
import { DeleteIcon } from '@/util/svg/icon.common';
import Underline from '@/components/atoms/common/Underline/Underline';
import moment from 'moment';
import customColor from '@/util/constant/color';
import { useDeleteDraft } from '@/hooks/mutations/feed.mutation';
import { useComposeStatus } from '@/context/composeStatusContext/composeStatus.context';
import { useDraftPostsActions } from '@/store/compose/draftPosts/draftPostsStore';
import { useManageAttachmentActions } from '@/store/compose/manageAttachments/manageAttachmentStore';
import {
	extractAllAudienceHashtags,
	getComposeUpdatePayload,
} from '@/util/helper/compose';
import CustomAlert from '../../common/CustomAlert/CustomAlert';
import { truncateStr } from '@/util/helper/helper';
import { useFavouriteChannelLists } from '@/hooks/queries/channel.queries';
import Graphemer from 'graphemer';
import { useEditAudienceStore } from '@/store/compose/audienceStore/editAudienceStore';
import { removeDraftPostFromDraftList } from '@/util/cache/compose/draftCache';
import { useTranslation } from 'react-i18next'; // <--- i18n import

interface DraftPostItemProps {
	item: Patchwork.DraftStatusItem;
	index: number;
	date: string;
	onClose: () => void;
}

const splitter = new Graphemer();

const DraftPostItem = ({ item, index, date, onClose }: DraftPostItemProps) => {
	const { t } = useTranslation(); // <--- hook
	const { setEditSelectedAudience } = useEditAudienceStore();
	const { composeState, composeDispatch } = useComposeStatus();
	const { setDraftType, setSelectedDraftId } = useDraftPostsActions();
	const { resetAttachmentStore, onAddMedia } = useManageAttachmentActions();
	const [delConfAlert, setDelConfAlert] = useState<{
		isVisible: boolean;
		id: string | null;
	}>({ isVisible: false, id: null });

	const { data: newsmastChannels } = useFavouriteChannelLists(false);
	const allAudienceHashtags = extractAllAudienceHashtags(newsmastChannels!);
	const filteredText = item.params.text
		.split(' ')
		.filter(word => !allAudienceHashtags.includes(word.trim()))
		.join(' ')
		.trim();

	const { mutate: deleteDraft, isPending: isDeletingDraft } = useDeleteDraft({
		onMutate: async deletedDraft => {
			setDraftType('create');
			setSelectedDraftId(null);
			removeDraftPostFromDraftList(deletedDraft.id);
		},
	});

	const onPressDelete = (id: string) => {
		deleteDraft({ id });
		setDelConfAlert({ isVisible: false, id: null });
	};

	const onPressStatus = (draft: Patchwork.DraftStatusItem) => {
		setSelectedDraftId(draft.id);
		clearComposeStates();

		const updateComposePayload = getComposeUpdatePayload({
			type: 'draft',
			item: draft,
			composeState,
		});

		composeDispatch(updateComposePayload);
		onAddMedia(
			draft.media_attachments.map(item => {
				return { ...item, sensitive: !!draft?.params?.sensitive };
			}),
		);

		if (newsmastChannels && newsmastChannels.length > 0) {
			const draftHashtags = new Set(
				item?.params?.text
					.split(/\s+/)
					.filter(word => word.startsWith('#'))
					.map(word => word.trim()),
			);

			const newSelectedAudience = newsmastChannels.map(channel => {
				const originalHashtags =
					channel.attributes?.patchwork_community_hashtags ?? [];
				const matchedHashtags = originalHashtags.filter(h =>
					draftHashtags.has(`#${h.hashtag}`),
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

			const allAudHashtags = extractAllAudienceHashtags(newsmastChannels);
			const filteredRaw = item?.params?.text?.replace(/#\w+/g, match => {
				const lower = match.toLowerCase();
				return allAudHashtags.some(tag => tag.toLowerCase() === lower)
					? ''
					: match;
			});

			composeDispatch({
				type: 'text',
				payload: {
					count: splitter.countGraphemes(filteredRaw),
					raw: filteredRaw,
				},
			});
			composeDispatch({
				type: 'spoilerText',
				payload: draft.params.spoiler_text || '',
			});
		}

		onClose();
		setDraftType('update');
	};

	const clearComposeStates = () => {
		resetAttachmentStore();
	};

	return (
		<View>
			<View className="flex-row py-3 border-l-patchwork-primary dark:border-l-patchwork-primary-dark border-l pl-3 my-3">
				<Pressable
					onPress={() => onPressStatus(item)}
					className="w-[85%] justify-center text-center"
				>
					<ThemeText>{truncateStr(filteredText, 120)}</ThemeText>
					{item.params?.poll && (
						<ThemeText variant={'textGrey'} size={'fs_13'} className="mt-1">
							{t('timeline.draft.includes_poll')}
						</ThemeText>
					)}
					{item.media_attachments.length > 0 && (
						<View
							className="justify-center items-center my-2"
							key={item.media_attachments[0].id}
						>
							<FastImage
								source={{ uri: item.media_attachments[0].preview_url }}
								resizeMode={'cover'}
								style={{
									width: '100%',
									height: scale(143),
									borderRadius: scale(5),
								}}
							/>
							{item.media_attachments.length > 1 && (
								<View className="p-1 absolute inset-0 bg-black/50 blur-sm rounded-full flex justify-center items-center">
									<ThemeText className="text-white font-NewsCycle_Bold">
										+{item.media_attachments.length - 1}
									</ThemeText>
								</View>
							)}
						</View>
					)}
					<ThemeText className="mt-1" variant={'textGrey'} size={'fs_13'}>
						{moment(date).format('MMM DD, YYYY')}
					</ThemeText>
				</Pressable>
				<Pressable
					onPress={() => setDelConfAlert({ isVisible: true, id: item.id })}
					className={`w-8 h-8 ml-auto z-10 bg-red-50 rounded-full aspect-square  items-center justify-center active:opacity-80 ${
						isDeletingDraft && delConfAlert.id === item.id ? 'opacity-50' : ''
					}`}
					disabled={isDeletingDraft && delConfAlert.id === item.id}
				>
					<DeleteIcon
						fill={
							isDeletingDraft && delConfAlert.id === item.id
								? customColor['patchwork-grey-400']
								: customColor['patchwork-red-50']
						}
					/>
				</Pressable>
			</View>
			{index !== undefined && <Underline />}
			<CustomAlert
				isVisible={delConfAlert.isVisible}
				hasCancel
				message={t('timeline.draft.delete_alert')}
				handleCancel={() => setDelConfAlert({ isVisible: false, id: null })}
				handleOk={() => {
					if (delConfAlert.id) onPressDelete(delConfAlert.id);
				}}
				confirmBtnText={t('common.delete')}
				type="error"
				isPendingConfirm={isDeletingDraft}
			/>
		</View>
	);
};

export default DraftPostItem;
