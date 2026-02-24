import React, { useCallback, useState } from 'react';
import { Dimensions, FlatList, Platform, Pressable, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import {
	Directions,
	Gesture,
	LongPressGestureHandler,
} from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { createZoomListComponent, Zoom } from 'react-native-reanimated-zoom';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootScreenProps } from '@/types/navigation';
import { ViewToken } from 'react-native';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import BackButton from '@/components/atoms/common/BackButton/BackButton';
import { useColorScheme } from 'nativewind';
import { runOnJS } from 'react-native-worklets';

const ZoomFlatList = createZoomListComponent(FlatList);
const IS_IOS = Platform.OS === 'ios';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const ImageViewer = ({
	route: {
		params: { id, imageUrls },
	},
	navigation,
}: RootScreenProps<'ImageViewer'>) => {
	const { colorScheme } = useColorScheme();
	const insets = useSafeAreaInsets();
	const isZoomed = useSharedValue(false);
	const initialIndex = imageUrls.findIndex(image => image.id === id);
	const [currentIndex, setCurrentIndex] = useState(initialIndex);

	const onViewableItemsChanged = useCallback(
		({ viewableItems }: { viewableItems: ViewToken[] }) => {
			setCurrentIndex(viewableItems[0]?.index || 0);
		},
		[],
	);

	if (!imageUrls || imageUrls.length === 0) {
		navigation.goBack();
		return null;
	}

	const absoluteHeader = IS_IOS ? insets.top : insets.top + 4 * 1;

	const renderItem = ({ item }: { item: Patchwork.ImageUrl }) => {
		if (!item || !item.url) return null;

		const screenRatio = WINDOW_WIDTH / WINDOW_HEIGHT;
		const imageRatio = item.width && item.height ? item.width / item.height : 1;

		const imageViewingSize = () => {
			if (item.width && item.height) {
				return {
					width:
						screenRatio > imageRatio
							? (WINDOW_HEIGHT / item.height) * item.width
							: WINDOW_WIDTH,
					height:
						screenRatio > imageRatio
							? WINDOW_HEIGHT
							: (WINDOW_WIDTH / item.width) * item.height,
				};
			}
			return { width: WINDOW_WIDTH, height: WINDOW_HEIGHT };
		};

		return (
			<Zoom
				onZoomBegin={() => (isZoomed.value = true)}
				onZoomEnd={() => (isZoomed.value = false)}
				maximumZoomScale={4}
				simultaneousGesture={Gesture.Fling()
					.direction(Directions.DOWN)
					.onStart(() => {
						if (!isZoomed.value) {
							runOnJS(navigation.goBack)();
						}
					})}
			>
				<View
					style={{
						width: WINDOW_WIDTH,
						height: WINDOW_HEIGHT,
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<FastImage
						source={{ uri: item.url }}
						style={[{ flex: 1 }, imageViewingSize()]}
						resizeMode={FastImage.resizeMode.contain}
					/>
				</View>
			</Zoom>
		);
	};

	return (
		<View className="flex-1 bg-black">
			<View
				style={{
					position: 'absolute',
					marginTop: absoluteHeader,
					width: '100%',
					zIndex: 999,
					margin: 10,
				}}
			>
				<Pressable
					style={{
						position: 'absolute',
						left: 4,
						width: 40,
						height: 40,
						alignItems: 'center',
						justifyContent: 'center',
						zIndex: 99,
						backgroundColor: '#00000080',
						borderRadius: 100,
					}}
					onPress={() => navigation.goBack()}
					children={<BackButton forceLight />}
				/>
				{imageUrls.length > 1 && (
					<View
						style={{
							alignItems: 'center',
							justifyContent: 'center',
							marginTop: 2 + 4,
						}}
					>
						<ThemeText>
							{currentIndex + 1} / {imageUrls.length}
						</ThemeText>
					</View>
				)}
			</View>
			<LongPressGestureHandler>
				<ZoomFlatList
					data={imageUrls}
					pagingEnabled
					horizontal
					keyExtractor={item => item.id}
					renderItem={renderItem}
					onViewableItemsChanged={onViewableItemsChanged}
					viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
					initialScrollIndex={initialIndex}
					getItemLayout={(_, index) => ({
						length: WINDOW_WIDTH,
						offset: WINDOW_WIDTH * index,
						index,
					})}
				/>
			</LongPressGestureHandler>
		</View>
	);
};

export default ImageViewer;
