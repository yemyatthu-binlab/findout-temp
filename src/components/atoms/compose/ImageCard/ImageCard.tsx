import { useUploadComposeImageMutation } from '@/hooks/mutations/feed.mutation';
import {
	useManageAttachmentActions,
	useManageAttachmentStore,
} from '@/store/compose/manageAttachments/manageAttachmentStore';
import { useEffect, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import { Asset } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import { useComposeStatus } from '@/context/composeStatusContext/composeStatus.context';
import { ComposeType } from '@/context/composeStatusContext/composeStatus.type';
import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';
import MediaItem from '../MediaItem/MediaItem';
import SmallMediaItem from '../SmallMediaItem/SmallMediaItem';

type Props = {
	composeType: ComposeType;
};

export function isAsset(item: Asset | Patchwork.Attachment): item is Asset {
	return 'uri' in item && !!item.uri;
}

const ImageCard = ({ composeType }: Props) => {
	const { t } = useTranslation();
	const { composeDispatch } = useComposeStatus();
	const previousImageCount = useRef(0);
	const selectedMedia = useManageAttachmentStore(state => state.selectedMedia);
	const progressInfo = useManageAttachmentStore(state => state.progress);
	const [isProcressingFastImage, setIsProcessingFastImage] = useState<
		boolean[]
	>([]);
	const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);
	const isScreenFocused = useIsFocused();

	const {
		onremoveMedia,
		onProgressIndexChange,
		onProgressChange,
		resetAttachmentStore,
		onReplaceMedia,
		onMediaUploadSuccess,
	} = useManageAttachmentActions();

	const { mutateAsync, isPending } = useUploadComposeImageMutation({
		onSuccess: async (response, variables) => {
			const uploadedIndex = selectedMedia.findIndex(
				(m): m is Asset => isAsset(m) && m.uri === variables.image.uri,
			);

			if (uploadedIndex !== -1) {
				onMediaUploadSuccess(uploadedIndex, response);
			}

			onProgressChange(100);
			onProgressIndexChange(undefined);

			if (progressInfo.currentIndex !== undefined) {
				onReplaceMedia(progressInfo.currentIndex, {
					...response,
					preview_url: variables.image.uri,
				});
			}

			composeDispatch({
				type: 'media_add',
				payload: [response.id],
			});
		},
		onError: error => {
			Toast.show({
				type: 'errorToast',
				text1: t('toast.image_incorrect_format_error'),
				position: 'top',
				topOffset: Platform.OS == 'android' ? 25 : 50,
			});
			resetAttachmentStore();
			composeDispatch({
				type: 'media_add',
				payload: [],
			});
		},
	});

	useEffect(() => {
		if (!isScreenFocused) {
			setActiveVideoIndex(null);
		}
	}, [isScreenFocused]);

	useEffect(() => {
		const currentMediaCount = selectedMedia.length;
		if (currentMediaCount > previousImageCount.current) {
			const newMediaList = selectedMedia.slice(
				previousImageCount.current,
				currentMediaCount,
			);
			startMediaUploading(newMediaList);
		}
		previousImageCount.current = currentMediaCount;
	}, [selectedMedia]);

	const startMediaUploading = async (newMediaList: Asset[]) => {
		if (isPending) return;
		for (const media of newMediaList) {
			if (
				media.type?.startsWith('video') &&
				media.fileSize &&
				media.fileSize > 40 * 1024 * 1024
			) {
				Toast.show({
					type: 'errorToast',
					text1: t('compose.video_size_too_large'),
				});
				onremoveMedia(
					selectedMedia.findIndex((m: Asset) => m.uri === media.uri),
				);
				continue;
			}
			const currentIdx = selectedMedia.findIndex(
				(item): item is Asset => 'uri' in item && item.uri === media.uri,
			);
			if (currentIdx !== -1) {
				onProgressIndexChange(currentIdx);
				await mutateAsync({ image: media, onProgressChange });
			}
		}
	};

	const handleImageRemove = (index: number) => {
		composeDispatch({
			type: 'media_remove',
			payload: index,
		});
		onremoveMedia(index);
	};

	const handleLoadStart = (index: number) => {
		setIsProcessingFastImage(prev => {
			const newStates = [...prev];
			newStates[index] = true;
			return newStates;
		});
	};

	const handleLoadEnd = (index: number) => {
		setIsProcessingFastImage(prev => {
			const newStates = [...prev];
			newStates[index] = false;
			return newStates;
		});
	};

	const handleTogglePlay = (
		index: number,
		item: Asset | Patchwork.Attachment,
	) => {
		const isVideo = isAsset(item)
			? item.type?.startsWith('video')
			: item.type === 'video';
		if (isVideo) {
			setActiveVideoIndex(activeVideoIndex === index ? null : index);
		}
	};

	return (
		<View
			accessibilityLabel="image-card"
			className={
				composeType === 'edit'
					? '-mx-4'
					: composeType === 'create' || composeType === 'schedule'
					? '-mx-4'
					: ''
			}
		>
			{['reply', 'chat'].includes(composeType) ? (
				<View>
					<View className="flex-row flex-wrap rounded-xl overflow-hidden">
						{selectedMedia.map((item, index) => (
							<SmallMediaItem
								key={isAsset(item) ? item.uri : item.id}
								{...{
									item,
									index,
									progressInfo,
									composeType,
									isPending,
									isActiveVideo: activeVideoIndex === index,
									handleImageRemove,
									onTogglePlay: () => handleTogglePlay(index, item),
								}}
							/>
						))}
					</View>
				</View>
			) : (
				<View className="my-5">
					<View className="flex-row flex-wrap rounded-xl overflow-hidden">
						{selectedMedia.map((item, index) => {
							const imageUri = isAsset(item) ? item.uri : item.preview_url;

							return (
								<MediaItem
									{...{
										item,
										index,
										progressInfo,
										isActiveVideo: activeVideoIndex === index,
										isProcressingFastImage,
										isPending,
										selectedMedia,
										handleLoadStart,
										handleLoadEnd,
										handleImageRemove,
										imageUri,
										onTogglePlay: () => handleTogglePlay(index, item),
									}}
								/>
							);
						})}
					</View>
				</View>
			)}
		</View>
	);
};

export default ImageCard;
