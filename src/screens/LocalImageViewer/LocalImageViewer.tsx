import React from 'react';
import { Dimensions, Pressable, View, Platform } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import { Directions, Gesture } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { Zoom } from 'react-native-reanimated-zoom';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootScreenProps } from '@/types/navigation';
import BackButton from '@/components/atoms/common/BackButton/BackButton';
import { runOnJS } from 'react-native-worklets';

const IS_IOS = Platform.OS === 'ios';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

type ImageUrl = {
	url: string;
	width?: number;
	height?: number;
	isLocal?: boolean;
};

const LocalImageViewer = ({
	route: {
		params: { imageUrl },
	},
	navigation,
}: RootScreenProps<'LocalImageViewer'> & {
	route: { params: { imageUrl: ImageUrl } };
}) => {
	const insets = useSafeAreaInsets();
	const isZoomed = useSharedValue(false);

	const absoluteHeader = IS_IOS ? insets.top : insets.top + 4 * 1;

	const imageViewingSize = () => {
		if (imageUrl.width && imageUrl.height) {
			const scaleHeight = WINDOW_HEIGHT / imageUrl.height;
			const scaleWidth = WINDOW_WIDTH / imageUrl.width;
			const scale = Math.min(scaleHeight, scaleWidth);

			return {
				width: imageUrl.width * scale,
				height: imageUrl.height * scale,
			};
		}
		return { width: WINDOW_WIDTH, height: WINDOW_HEIGHT };
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
				>
					<BackButton forceLight />
				</Pressable>
			</View>

			{/* Image Zoom Viewer */}
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
						source={
							imageUrl.isLocal
								? { uri: imageUrl.url }
								: { uri: imageUrl.url, priority: FastImage.priority.normal }
						}
						style={[{ flex: 1 }, imageViewingSize()]}
						resizeMode={FastImage.resizeMode.contain}
					/>
				</View>
			</Zoom>
		</View>
	);
};

export default LocalImageViewer;
