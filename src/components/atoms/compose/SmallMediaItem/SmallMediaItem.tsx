import { usePollMediaStatus } from '@/hooks/queries/feed.queries';
import { useManageAttachmentActions } from '@/store/compose/manageAttachments/manageAttachmentStore';
import { isTablet } from '@/util/helper/isTablet';
import { cn } from '@/util/helper/twutil';
import { CloseIcon } from '@/util/svg/icon.compose';
import { useEffect } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { Blurhash } from 'react-native-blurhash';
import FastImage from '@d11/react-native-fast-image';
import { Asset } from 'react-native-image-picker';
import Video, { ResizeMode } from 'react-native-video';
import { styled, useColorScheme } from 'nativewind';
import { ComposeType } from '@/context/composeStatusContext/composeStatus.type';
import { isAsset } from '../ImageCard/ImageCard';
import ImageProgressBar from '../ImageProgressBar/ImageProgressBar';

type SmallMediaItemProps = {
	item: Asset | (Patchwork.Attachment & { processing?: boolean });
	index: number;
	progressInfo: any;
	isActiveVideo: boolean;
	isPending: boolean;
	composeType: ComposeType;
	onTogglePlay: () => void;
	handleImageRemove: (index: number) => void;
};

const StyledVideo = styled(Video);

const SmallMediaItem = ({
	item,
	index,
	progressInfo,
	isActiveVideo,
	isPending,
	composeType,
	onTogglePlay,
	handleImageRemove,
}: SmallMediaItemProps) => {
	const { colorScheme } = useColorScheme();
	const mediaUri = isAsset(item) ? item.uri : item.preview_url;
	const isVideo = isAsset(item)
		? item.type?.startsWith('video')
		: item.type === 'video';
	const isProcessing = 'processing' in item && item.processing;
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
				'w-1/4 h-16 rounded-lg border-slate-50 dark:border-patchwork-dark-400 border-2 mb-2',
				composeType === 'chat' && 'mt-2',
				isTablet && 'w-[120px] h-[80px]',
			)}
		>
			<View className="w-full h-full rounded-md overflow-hidden bg-black">
				{isVideo ? (
					<>
						<StyledVideo
							source={{ uri: mediaUri }}
							className="w-full h-full"
							resizeMode={ResizeMode.COVER}
							paused={true}
							repeat={false}
							playInBackground={false}
							playWhenInactive={false}
						/>
					</>
				) : (
					<>
						{!isAsset(item) && item.sensitive ? (
							<Blurhash
								decodeAsync
								blurhash={item?.blurhash ?? ''}
								style={{ height: '100%', width: '100%' }}
							/>
						) : (
							<FastImage
								className="w-full h-full"
								source={{
									uri: mediaUri,
									priority: FastImage.priority.high,
									cache: FastImage.cacheControl.immutable,
								}}
								resizeMode={'cover'}
							/>
						)}
					</>
				)}
			</View>

			<Pressable
				disabled={isPending}
				onPress={() => handleImageRemove(index)}
				className="bg-black/60 w-[18px] h-[18px] p-1 items-center rounded-full justify-center absolute right-1 top-1 active:opacity-40 z-20"
			>
				<CloseIcon width={16} height={16} fill={'#fff'} />
			</Pressable>

			{isProcessing && (
				<View className="absolute inset-0 top-0 bottom-0 right-0 left-0 flex items-center justify-center bg-black/50 z-10">
					<ActivityIndicator color="white" size="small" />
				</View>
			)}

			{progressInfo?.currentIndex != undefined && (
				<>
					{progressInfo?.currentIndex <= index && (
						<View className="bg-slate-100 absolute opacity-50 top-0 bottom-0 right-0 left-0" />
					)}

					{!isProcessing && progressInfo?.currentIndex == index && (
						<View className="absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center">
							<ImageProgressBar size={25} />
						</View>
					)}
				</>
			)}
		</Pressable>
	);
};

export default SmallMediaItem;
