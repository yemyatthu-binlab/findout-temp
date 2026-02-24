import React, { useEffect, useState, useRef } from 'react';
import ThemeModal from '@/components/atoms/common/ThemeModal/ThemeModal';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { Image, Pressable, View } from 'react-native';
import TextInput from '../../common/TextInput/TextInput';
import {
	useEditPhotoMeta,
	useEditPhotoMetaActions,
} from '@/store/compose/editPhotoMeta/editPhotoMeta';
import { Blurhash } from 'react-native-blurhash';
import FastImage from '@d11/react-native-fast-image';
import {
	useManageAttachmentActions,
	useManageAttachmentStore,
} from '@/store/compose/manageAttachments/manageAttachmentStore';
import Checkbox from '../../common/Checkbox/Checkbox';
import { useComposeStatus } from '@/context/composeStatusContext/composeStatus.context';
import {
	useComposeMutation,
	useMediaAttachmentMutation,
	useUploadComposeImageMutation,
} from '@/hooks/mutations/feed.mutation';
import { getFileNameFromUri, handleError } from '@/util/helper/helper';
import { isAsset } from '../ImageCard/ImageCard';
import { ComposeType } from '@/context/composeStatusContext/composeStatus.type';
import { prepareComposePayload } from '@/util/helper/compose';
import ImagePicker from 'react-native-image-crop-picker';
import {
	getCacheQueryKeys,
	StatusCacheQueryKeys,
} from '@/util/cache/queryCacheHelper';
import { useSelectedDomain } from '@/store/feed/activeDomain';
import { editedStatusCacheData } from '@/util/cache/statusActions/editStatusCache';
import { queryClient } from '@/App';
import { useAuthStore } from '@/store/auth/authStore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { cn } from '@/util/helper/twutil';
import { isTablet } from '@/util/helper/isTablet';
import { useTranslation } from 'react-i18next';
import Video, { ResizeMode } from 'react-native-video';
import { styled } from 'nativewind';

const StyledVideo = styled(Video);

type Props = {
	onClose: () => void;
	composeType: ComposeType;
	incomingStatus: Patchwork.Status | null;
};

const EditPhotoModal: React.FC<Props> = ({
	onClose,
	composeType,
	incomingStatus,
}) => {
	const { t } = useTranslation();
	const domain_name = useSelectedDomain();
	const { userInfo } = useAuthStore();
	const { selectedPhoto } = useEditPhotoMeta();
	const { closeEditPhotoModal } = useEditPhotoMetaActions();
	const { selectedMedia: totalSelectedMedia } = useManageAttachmentStore();
	const { onReplaceMedia } = useManageAttachmentActions();
	const { composeState, composeDispatch } = useComposeStatus();
	const [media, setMedia] = useState<Patchwork.Attachment | null>(null);
	const originalImgDimesnions = useRef({ width: 0, height: 0 });
	const isImageCropped = useRef(false);
	const mediaRef = useRef(media); // to bypass react's batch updates beahviour to use image id instantly after image is edited
	const totalSelectedMediaRef = useRef(totalSelectedMedia); //to bypass react's batch updates beahviour to use image id instantly after image is edited

	const maxAltWordCount = 1000;

	const accountDetailFeedQueryKey = [
		'account-detail-feed',
		{
			domain_name: domain_name,
			account_id: userInfo?.id!,
			exclude_replies: true,
			exclude_reblogs: false,
			exclude_original_statuses: false,
		},
	];
	const channelFeedQueryKey = [
		'channel-feed',
		{ domain_name, remote: false, only_media: false },
	];

	useEffect(() => {
		if (selectedPhoto) {
			totalSelectedMedia.find(attachment => {
				if (attachment?.id === selectedPhoto?.id) {
					setMedia({
						...(attachment as Patchwork.Attachment),
						sensitive:
							typeof selectedPhoto.sensitive === 'undefined' &&
							composeType === 'edit'
								? incomingStatus?.sensitive
								: selectedPhoto.sensitive,
					});
				}
			});
		}
	}, [selectedPhoto, incomingStatus, composeType]);

	useEffect(() => {
		if (media?.preview_url) {
			Image.getSize(
				media.preview_url,
				(width, height) => (originalImgDimesnions.current = { width, height }),
				error => {},
			);
		}
	}, [media?.preview_url]);

	// mutations
	// use for create or repost compose type
	const { mutateAsync, isPending: isPendingAltText } =
		useMediaAttachmentMutation({
			onError: error => {
				handleError(error);
			},
		});

	// use for edit compose type
	const { mutate, isPending: isPendingSensitiveState } = useComposeMutation({
		onSuccess: (status: Patchwork.Status) => {
			if (incomingStatus?.id) {
				const queryKeys = getCacheQueryKeys<StatusCacheQueryKeys>(
					status.account.id,
					status.in_reply_to_id,
					status.in_reply_to_account_id,
					status.reblog ? true : false,
					domain_name,
				);
				editedStatusCacheData({
					status_id: status.id,
					updatedStatus: status,
					queryKeys,
				});
			} else {
				queryClient.invalidateQueries({ queryKey: accountDetailFeedQueryKey });
				queryClient.invalidateQueries({ queryKey: channelFeedQueryKey });
			}
		},
	});

	const { mutateAsync: uploadImage, isPending: isImageUploading } =
		useUploadComposeImageMutation({
			onSuccess: (res, variable) => {
				if (!mediaRef?.current) return;
				composeDispatch({
					type: 'media_replace',
					payload: {
						prevMediaId: mediaRef?.current.id || '',
						newMediaId: res.id,
					},
				});
				const updatedMedia = {
					...(mediaRef?.current as Patchwork.Attachment),
					previewUrl: variable.image.uri || '',
					url: variable.image.uri || '',
					id: res.id,
				};
				setMedia(updatedMedia);
				mediaRef.current = updatedMedia;
				updateMediaIndex(
					idx => (totalSelectedMediaRef.current[idx] = updatedMedia),
				);
				updateMediaIndex(idx => onReplaceMedia(idx, updatedMedia));
			},
		});

	// handlers
	const handleAltTextChange = (value: string) => {
		if (value.length > maxAltWordCount) {
			// Noted by sev: need to show toast message or alert
			return;
		}
		setMedia(media ? { ...media, description: value } : null);
	};

	const updateMediaIndex = (callBack: (idx: number) => void) => {
		if (!media) return;
		const index = totalSelectedMedia.findIndex(item => item.id === media.id);
		if (index !== -1) {
			callBack(index);
		}
	};

	const handleSensitiveCheckbox = () => {
		if (media) {
			const updatedMedia = { ...media, sensitive: !media.sensitive };
			setMedia(updatedMedia);
		}
	};
	const onUpdateMedia = async () => {
		mediaRef.current = media;
		totalSelectedMediaRef.current = totalSelectedMedia;
		if (!mediaRef.current) return;
		const isEditing = composeType === 'edit' && incomingStatus?.id.length! > 0;
		const isCreatingOrReposting =
			composeType === 'create' ||
			composeType === 'schedule' ||
			composeType === 'repost';
		if (isImageCropped.current) {
			await startImageUploading(mediaRef.current);
		}
		if (isEditing) {
			let payload = prepareComposePayload(composeState);
			payload.media_ids = totalSelectedMediaRef.current.map(media => media.id!);
			payload.sensitive = mediaRef.current?.sensitive;

			const mediaAttributes = totalSelectedMediaRef.current.map(v => {
				if (isAsset(v)) return;

				if (v.id === mediaRef.current?.id) {
					return {
						id: mediaRef.current?.id!,
						description: mediaRef.current?.description || '',
					};
				}
			});

			if (mediaAttributes) {
				payload.media_attributes = mediaAttributes.filter(
					(attr): attr is { id: string; description: string } =>
						attr !== undefined,
				);
			}
			mutate({
				statusId: incomingStatus?.id,
				...payload,
			});

			updateMediaIndex(idx => onReplaceMedia(idx, mediaRef?.current!));

			// for composeState
			composeDispatch({
				type: 'sensitive',
				payload: mediaRef?.current?.sensitive,
			});
			closeEditPhotoModal();
		}
		if (isCreatingOrReposting) {
			if (mediaRef?.current?.description) {
				let updatedMedia = await mutateAsync({
					id: mediaRef?.current.id,
					description: media?.description || '',
				});

				updatedMedia.sensitive = mediaRef?.current.sensitive;
				updateMediaIndex(idx => onReplaceMedia(idx, updatedMedia));
			}
			composeDispatch({
				type: 'sensitive',
				payload: mediaRef?.current.sensitive,
			});
			updateMediaIndex(idx => onReplaceMedia(idx, mediaRef?.current!));
			closeEditPhotoModal();
		}
	};

	const startImageUploading = async (media: Patchwork.Attachment) => {
		if (isImageUploading) return;
		await uploadImage({
			image: {
				fileName: getFileNameFromUri(media.preview_url),
				fileSize:
					originalImgDimesnions.current.height *
					originalImgDimesnions.current.width,
				height: originalImgDimesnions.current.height,
				width: originalImgDimesnions.current.width,
				uri: media.preview_url,
				type: 'image/jpg',
			},
			onProgressChange: () => {},
		});
	};

	const handleImageCrop = async () => {
		try {
			const res = await ImagePicker.openCropper({
				path: media?.preview_url || '',
				mediaType: 'photo',
				width: originalImgDimesnions.current.width,
				height: originalImgDimesnions.current.height,
				freeStyleCropEnabled: true,
				forceJpg: true,
			});
			if (!!media && res) {
				isImageCropped.current = true;
				updateMediaIndex(() => setMedia({ ...media, preview_url: res.path }));
			}
		} catch (err) {
			console.log('Error in cropping image', err);
		}
	};

	const isVideo = media?.type === 'video';
	const isLocalEdit = !media?.preview_url?.includes('png');

	return (
		<ThemeModal
			visible
			onClose={onClose}
			type="default"
			title={isVideo ? 'Edit video' : t('compose.editPhotoModal.title')}
			confirm={{
				text: t('compose.editPhotoModal.confirm'),
				onPress: onUpdateMedia,
				isPending:
					isPendingAltText || isPendingSensitiveState || isImageUploading,
			}}
		>
			<KeyboardAwareScrollView
				showsVerticalScrollIndicator={false}
				enableOnAndroid={true}
				style={{ marginHorizontal: -15 }}
				keyboardShouldPersistTaps={'handled'}
			>
				<View
					className={cn('px-4 mb-40', isTablet ? 'w-[50%] self-center' : '')}
				>
					{selectedPhoto && media?.sensitive ? (
						<View className="rounded-md overflow-hidden">
							<Blurhash
								decodeAsync
								blurhash={media?.blurhash ?? ''}
								style={{ height: isTablet ? 400 : 230, width: '100%' }}
								resizeMode="cover"
							/>
						</View>
					) : isVideo && isLocalEdit ? (
						<View className="w-full h-[230] rounded-md overflow-hidden bg-black justify-center items-center">
							<StyledVideo
								source={{ uri: media?.preview_url }}
								resizeMode={ResizeMode.COVER}
								paused={true}
								playInBackground={false}
								playWhenInactive={false}
							/>
						</View>
					) : (
						<FastImage
							className={`w-full ${
								isTablet ? 'h-[400]' : 'h-[230]'
							} rounded-md`}
							source={{
								uri: media?.preview_url,
								priority: FastImage.priority.normal,
							}}
							resizeMode="cover"
						/>
					)}
					<View className="mt-5">
						<Checkbox
							isChecked={media?.sensitive || false}
							handleOnCheck={handleSensitiveCheckbox}
						>
							<ThemeText className="mx-4">
								{isVideo
									? 'This video may include sensitive content for some groups of people.'
									: t('compose.editPhotoModal.sensitiveWarning')}
							</ThemeText>
						</Checkbox>
					</View>
					<View className="mt-5">
						<TextInput
							placeholder={t('compose.editPhotoModal.altPlaceholder')}
							onChangeText={handleAltTextChange}
							value={media?.description || ''}
							autoCapitalize="sentences"
							autoComplete="off"
							autoCorrect={false}
							endIcon={
								<ThemeText
									variant="textPrimary"
									className="absolute right-4 top-2/4 -mt-0.5"
								>
									{maxAltWordCount - (media?.description?.length || 0)}
								</ThemeText>
							}
						/>
					</View>
					{media && media.type === 'image' && (
						<View className="absolute top-2 right-6">
							<Pressable
								className="active:opacity-70 px-5 bg-[#0008] p-2 rounded-md"
								onPress={handleImageCrop}
							>
								<ThemeText className="text-white">
									{t('compose.editPhotoModal.edit')}
								</ThemeText>
							</Pressable>
						</View>
					)}
				</View>
			</KeyboardAwareScrollView>
		</ThemeModal>
	);
};

export default EditPhotoModal;
