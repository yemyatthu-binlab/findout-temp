import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import { CloseIcon } from '@/util/svg/icon.common';
import customColor from '@/util/constant/color';
import { Flow } from 'react-native-animated-spinkit';
import { useComposeStatus } from '@/context/composeStatusContext/composeStatus.context';
import useDebounce from '@/hooks/custom/useDebounce';
import { useLinkPreviewQueries } from '@/hooks/queries/feed.queries';
import FastImage from '@d11/react-native-fast-image';
import { ComposeType } from '@/context/composeStatusContext/composeStatus.type';
import { useColorScheme } from 'nativewind';

type Props = {
	composeType: ComposeType;
};

export const LinkCard = ({ composeType }: Props) => {
	const { colorScheme } = useColorScheme();
	const { composeState, composeDispatch } = useComposeStatus();
	const [debounceLinkRes, setDebounceVal] = useState('');
	const startDebounce = useDebounce();

	const {
		data: previewData,
		isFetching,
		isError,
	} = useLinkPreviewQueries({
		url: debounceLinkRes,
		enabled: !!debounceLinkRes,
	});

	useEffect(() => {
		if (composeState.link.firstLinkUrl) {
			startDebounce(() => setDebounceVal(composeState.link.firstLinkUrl), 500);
		}
	}, [composeState.link.firstLinkUrl]);

	const handleLinkCardClose = () => {
		composeDispatch({
			type: 'link',
			payload: {
				isLinkInclude: composeState.link.isLinkInclude,
				showLinkCard: false,
				firstLinkUrl: composeState.link.firstLinkUrl,
			},
		});
	};

	if (!composeState.link.showLinkCard || !composeState.link.isLinkInclude) {
		return <></>;
	}

	if (isFetching || isError || previewData === undefined) {
		return (
			<View accessibilityLabel="link-card">
				{composeType == 'reply' ? (
					<View className="flex-row items-center justify-center border border-slate-400 dark:border-slate-600 p-1 rounded-md mb-2">
						<View className="w-[55] h-[55] bg-patchwork-dark-50 rounded ml-1 items-center justify-center">
							{isFetching && (
								<Flow
									size={20}
									color={
										colorScheme === 'dark'
											? customColor['patchwork-primary-dark']
											: customColor['patchwork-primary']
									}
								/>
							)}
						</View>
						<View className="p-3 flex-1">
							<ThemeText>
								{isError ? 'Failed to fetch link preview' : '....'}
							</ThemeText>
							<ThemeText size="xs_12" className="mt-1 underline">
								{composeState.link.firstLinkUrl}
							</ThemeText>
						</View>
						<Pressable
							onPress={() => handleLinkCardClose()}
							className="bg-white opacity-60 w-[16] h-[16] p-1 items-center rounded-full justify-center absolute right-2 top-2 active:opacity-40"
						>
							<CloseIcon width={17} height={17} stroke={'#fff'} />
						</Pressable>
					</View>
				) : (
					<View className="mt-8 pb-2 rounded-xl border-slate-400 dark:border-slate-600 border">
						<View className="w-full h-[200] bg-patchwork-dark-50 rounded-tl-xl rounded-tr-xl items-center justify-center">
							{isFetching && (
								<Flow size={25} color={customColor['patchwork-primary']} />
							)}
						</View>
						<View className="p-3">
							<ThemeText>
								{isError ? 'Failed to fetch link preview' : '....'}
							</ThemeText>
							<ThemeText size="xs_12" className="mt-1 underline">
								{composeState.link.firstLinkUrl}
							</ThemeText>
						</View>
						<Pressable
							onPress={() => handleLinkCardClose()}
							className="bg-black opacity-50 w-[20] h-[20] p-1 items-center rounded-full justify-center absolute right-2 top-2 active:opacity-40"
						>
							<CloseIcon stroke={'#fff'} />
						</Pressable>
					</View>
				)}
			</View>
		);
	}

	return (
		<View>
			{previewData && !isFetching && !isError && (
				<>
					{composeType == 'reply' ? (
						<View className="flex-row items-center justify-center border border-slate-400 dark:first-letter:border-slate-600 p-1 rounded-md mb-2">
							<FastImage
								source={{ uri: previewData.images[0]?.src }}
								resizeMode={'cover'}
								className="w-[55] h-[55] bg-patchwork-dark-50 rounded ml-1"
							/>
							<View className="p-3 flex-1">
								<ThemeText>{previewData.title}</ThemeText>
								<ThemeText size="xs_12" className="mt-1 underline">
									{previewData.url}
								</ThemeText>
							</View>
							<Pressable
								onPress={() => handleLinkCardClose()}
								className="bg-white opacity-60 w-[16] h-[16] p-1 items-center rounded-full justify-center absolute right-2 top-2 active:opacity-40"
							>
								<CloseIcon width={17} height={17} stroke={'#fff'} />
							</Pressable>
						</View>
					) : (
						<View className="mt-8 pb-2 rounded-xl border-slate-400 dark:border-slate-600 border">
							<FastImage
								source={{ uri: previewData.images[0]?.src }}
								resizeMode={'cover'}
								className="w-full h-[200] bg-patchwork-dark-50 rounded-tl-xl rounded-tr-xl"
							/>
							<View className="p-3">
								<ThemeText>{previewData.title}</ThemeText>
								<ThemeText size="xs_12" className="mt-1 underline">
									{previewData.url}
								</ThemeText>
							</View>
							<Pressable
								onPress={() => handleLinkCardClose()}
								className="bg-black opacity-50 w-[20] h-[20] p-1 items-center rounded-full justify-center absolute right-2 top-2 active:opacity-40"
							>
								<CloseIcon stroke={'#fff'} />
							</Pressable>
						</View>
					)}
				</>
			)}
		</View>
	);
};
