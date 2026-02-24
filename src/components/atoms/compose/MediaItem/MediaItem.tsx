import React, { useEffect } from 'react';
import { Pressable, View, ActivityIndicator } from 'react-native';
import Video, { ResizeMode } from 'react-native-video';
import FastImage from '@d11/react-native-fast-image';
import { Asset } from 'react-native-image-picker';
import { usePollMediaStatus } from '@/hooks/queries/feed.queries';
import { cn } from '@/util/helper/twutil';
import { calculateImageWidth } from '@/util/helper/compose';
import { PlayIcon } from '@/util/svg/icon.common';
import { Blurhash } from 'react-native-blurhash';
import ImageProgressBar from '../ImageProgressBar/ImageProgressBar';
import { CloseIcon } from '@/util/svg/icon.compose';
import { useEditPhotoMetaActions } from '@/store/compose/editPhotoMeta/editPhotoMeta';
import { PenIcon } from '@/util/svg/icon.profile';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import { useTranslation } from 'react-i18next';
import { useManageAttachmentActions } from '@/store/compose/manageAttachments/manageAttachmentStore';
import { styled } from 'nativewind';

type MediaItemProps = {
	item: Asset | (Patchwork.Attachment & { processing?: boolean });
	index: number;
	progressInfo: any;
	isActiveVideo: boolean;
	isPending: boolean;
	isProcressingFastImage: boolean[];
	onTogglePlay: () => void;
	selectedMedia:
		| Asset[]
		| (Patchwork.Attachment & {
				processing?: boolean;
		  })[];
	handleLoadStart: (index: number) => void;
	handleLoadEnd: (index: number) => void;
	handleImageRemove: (index: number) => void;
	imageUri: string | undefined;
};

const StyledVideo = styled(Video);

const MediaItem = ({
	item,
	index,
	progressInfo,
	isActiveVideo,
	onTogglePlay,
	selectedMedia,
	isProcressingFastImage,
	handleLoadStart,
	handleLoadEnd,
	handleImageRemove,
	isPending,
	imageUri,
}: MediaItemProps) => {
	const { t } = useTranslation();
	const isAsset = (i: any): i is Asset => 'uri' in i && !!i.uri;

	const mediaUri = isAsset(item) ? item.uri : item.url;
	const isVideo = isAsset(item)
		? item.type?.startsWith('video')
		: item.type === 'video';
	const isProcessing = 'processing' in item && item.processing;
	const { onSelectedPhoto, openEditPhotoModal } = useEditPhotoMetaActions();
	const { onMediaProcessingComplete } = useManageAttachmentActions();

	const { data } = usePollMediaStatus(item.id, index, !!isProcessing);

	useEffect(() => {
		if (data && data.status === 200) {
			onMediaProcessingComplete(index, data.data);
		}
	}, [data, index, onMediaProcessingComplete]);

	return (
		<Pressable
			className={cn(
				'border-4 border-white dark:border-patchwork-dark-100 rounded-xl',
				calculateImageWidth(selectedMedia, index),
			)}
			onPress={onTogglePlay}
		>
			{isVideo ? (
				<View className="w-full h-full rounded-md bg-black justify-center items-center">
					<StyledVideo
						source={{ uri: mediaUri }}
						className="w-full h-full rounded-md"
						resizeMode={ResizeMode.COVER}
						paused={!isActiveVideo}
						repeat={true}
						playInBackground={false}
						playWhenInactive={false}
					/>
					{!isActiveVideo && (
						<View className="absolute inset-0 justify-center items-center">
							<View className="bg-black/50 p-2 aspect-square rounded-full">
								<PlayIcon
									width={24}
									height={24}
									fill="white"
									className="ml-[2]"
								/>
							</View>
						</View>
					)}
				</View>
			) : (
				<>
					{!isAsset(item) && isProcressingFastImage[index] && (
						<View className="bg-slate-100 absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center rounded-md overflow-hidden">
							<Blurhash
								blurhash={item?.blurhash ?? 'LEHV6nWB2yk8pyo0adR*.7kCMdnj'}
								style={{
									height: '100%',
									width: '100%',
									position: 'absolute',
									borderRadius: 6,
								}}
							/>
							<ImageProgressBar />
						</View>
					)}
					{!isAsset(item) && item.sensitive ? (
						<View className="rounded-md overflow-hidden">
							<Blurhash
								decodeAsync
								blurhash={item?.blurhash ?? ''}
								style={[
									{
										height: '100%',
										width: '100%',
										borderRadius: 6,
									},
								]}
							/>
						</View>
					) : (
						<FastImage
							className={cn('w-full h-full rounded-md')}
							source={{
								uri: imageUri,
								priority: FastImage.priority.high,
								cache: FastImage.cacheControl.immutable,
							}}
							resizeMode={'cover'}
							onLoadStart={() => handleLoadStart(index)}
							onLoad={() => handleLoadEnd(index)}
							onError={() => handleLoadEnd(index)}
						/>
					)}
				</>
			)}

			<Pressable
				disabled={isPending}
				onPress={() => handleImageRemove(index)}
				className={cn(
					'w-[20] h-[20] p-1 items-center rounded-full justify-center absolute right-2 top-2 active:opacity-40 z-20',
				)}
			>
				<CloseIcon fill={'#fff'} />
			</Pressable>
			<Pressable
				disabled={isPending || isProcessing}
				onPress={() => {
					onSelectedPhoto(item as Patchwork.Attachment);
					openEditPhotoModal();
				}}
				className={cn(
					'bg-[#36466366] border border-patchwork-grey-50 px-2 py-1 flex-row items-center rounded-3xl justify-center absolute left-2 top-2 active:opacity-40 z-20',
				)}
			>
				<PenIcon fill={'white'} />
				<ThemeText size={'fs_13'} className="ml-1 text-white">
					{t('edit')}
				</ThemeText>
			</Pressable>

			{isProcessing && (
				<View className="absolute inset-0 top-0 bottom-0 right-0 left-0 flex items-center justify-center bg-black/50 rounded-md z-10">
					<ActivityIndicator color="white" />
					<ThemeText className="text-white mt-2 text-xs">
						Processing ...
					</ThemeText>
				</View>
			)}

			{progressInfo?.currentIndex != undefined && (
				<>
					{progressInfo?.currentIndex <= index && (
						<View className="bg-slate-100 absolute opacity-50 top-0 bottom-0 right-0 left-0 rounded-md" />
					)}

					{!isProcessing && progressInfo?.currentIndex == index && (
						<View className="absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center">
							<ImageProgressBar />
						</View>
					)}
				</>
			)}
		</Pressable>
	);
};

export default MediaItem;
