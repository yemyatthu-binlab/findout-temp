import {
	blockUnBlockUserMutationFn,
	cancelSchedule,
	composeStatus,
	deleteDraft,
	favouriteStatus,
	followHashtag,
	muteUnMuteUserMutationFn,
	publishDraft,
	quoteStatus,
	reportMutationFn,
	repostStatus,
	repostUnRepost,
	saveDraft,
	translateMutationFn,
	updateAltTextSetting,
	updateMediaAttachment,
	updateSchedule,
	updateSpecificDraft,
	uploadComposeImage,
} from '@/services/feed.service';
import {
	ComposeImagePayload,
	ComposeMutationPayload,
	QuoteMutationPayload,
	ReportMutationPayload,
	RepostMutationPayload,
	SaveDraftPayload,
	UpdateMediaAttachmentQueryKey,
} from '@/types/queries/feed.type';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useComposeMutation = (
	options: UseMutationOptions<
		Patchwork.Status,
		AxiosError,
		ComposeMutationPayload
	>,
) => {
	return useMutation({ mutationFn: composeStatus, ...options });
};

export const useRepostMutation = (
	options: UseMutationOptions<
		Patchwork.Status,
		AxiosError,
		RepostMutationPayload
	>,
) => {
	return useMutation({ mutationFn: repostStatus, ...options });
};

export const useRepostUnRepostMutation = (
	options: UseMutationOptions<
		Patchwork.Status,
		AxiosError,
		RepostMutationPayload & { id: string; isRepost: boolean }
	>,
) => {
	return useMutation({ mutationFn: repostUnRepost, ...options });
};

export const useQuoteMutation = (
	options: UseMutationOptions<
		Patchwork.Status,
		AxiosError,
		QuoteMutationPayload
	>,
) => {
	return useMutation({ mutationFn: quoteStatus, ...options });
};

export const useUploadComposeImageMutation = (
	options: UseMutationOptions<
		Patchwork.Attachment,
		AxiosError,
		ComposeImagePayload
	>,
) => {
	return useMutation({ mutationFn: uploadComposeImage, ...options });
};

export const useFavouriteMutation = (
	options: UseMutationOptions<
		Patchwork.Status,
		AxiosError,
		{ status: Patchwork.Status }
	>,
) => {
	return useMutation({ mutationFn: favouriteStatus, ...options });
};

export const useHashtagFollowMutation = (
	options: UseMutationOptions<
		Patchwork.HashtagDetail,
		AxiosError,
		{ hashtag: string; isAlreadyFollowing: boolean }
	>,
) => {
	return useMutation({ mutationFn: followHashtag, ...options });
};

export const useMuteUnmuteUserMutation = (
	options: UseMutationOptions<
		Patchwork.RelationShip,
		AxiosError,
		{ accountId: string; toMute: boolean }
	>,
) => {
	return useMutation({ mutationFn: muteUnMuteUserMutationFn, ...options });
};

export const useBlockUnBlockUserMutation = (
	options: UseMutationOptions<
		Patchwork.RelationShip,
		AxiosError,
		{ accountId: string; toBlock: boolean }
	>,
) => {
	return useMutation({ mutationFn: blockUnBlockUserMutationFn, ...options });
};

export const useReportMutation = (
	options: UseMutationOptions<any, AxiosError, ReportMutationPayload>,
) => {
	return useMutation({ mutationFn: reportMutationFn, ...options });
};

export const useTranslateMutation = (
	options: UseMutationOptions<
		{ content: string },
		AxiosError,
		{ statusId: string }
	>,
) => {
	return useMutation({ mutationFn: translateMutationFn, ...options });
};

export const useMediaAttachmentMutation = (
	options: UseMutationOptions<
		Patchwork.Attachment,
		AxiosError,
		UpdateMediaAttachmentQueryKey[1]
	>,
) => {
	return useMutation({ mutationFn: updateMediaAttachment, ...options });
};

export const useSaveDraftMutation = (
	options: UseMutationOptions<
		Patchwork.DraftStatusItem,
		AxiosError,
		SaveDraftPayload
	>,
) => {
	return useMutation({ mutationFn: saveDraft, ...options });
};

export const useDeleteDraft = (
	options: UseMutationOptions<
		Patchwork.DraftStatusItem,
		AxiosError,
		{ id: string }
	>,
) => {
	return useMutation({ mutationFn: deleteDraft, ...options });
};

export const useUpdateSpecificDraftMutation = (
	options?: UseMutationOptions<
		Patchwork.DraftStatusItem,
		AxiosError,
		{ id: string; payload: SaveDraftPayload }
	>,
) => {
	return useMutation({
		mutationFn: ({ id, payload }) => updateSpecificDraft(id, payload),
		...options,
	});
};

export const usePublishDraftMutation = (
	options?: UseMutationOptions<
		Patchwork.Status,
		AxiosError,
		{ id: string; payload: SaveDraftPayload }
	>,
) => {
	return useMutation({
		mutationFn: ({ id, payload }) => publishDraft(id, payload),
		...options,
	});
};

export const useUpdateScheduleMutation = (
	options: UseMutationOptions<
		Patchwork.Schedule,
		AxiosError,
		ComposeMutationPayload
	>,
) => {
	return useMutation({ mutationFn: updateSchedule, ...options });
};

export const useCancelScheduleMutation = (
	options: UseMutationOptions<{ message?: string }, AxiosError, { id: string }>,
) => {
	return useMutation({ mutationFn: cancelSchedule, ...options });
};

export const useUpdateAltTextSetting = (
	options: UseMutationOptions<
		{ data: boolean },
		AxiosError,
		{ enabled: boolean }
	>,
) => {
	return useMutation({ mutationFn: updateAltTextSetting, ...options });
};
