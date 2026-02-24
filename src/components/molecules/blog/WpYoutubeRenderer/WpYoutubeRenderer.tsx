import { Dimensions, Platform, useWindowDimensions, View } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import type { RenderersProps } from 'react-native-render-html';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { extractYouTubeId } from '@/util/helper/helper';

const { width } = Dimensions.get('window');

const WpYoutubeRenderer: React.FC<RenderersProps> = props => {
	const { tnode } = props;
	const { left } = useSafeAreaInsets();

	const src = tnode.attributes.src;
	const videoId = extractYouTubeId(src);

	if (!videoId) {
		return null;
	}

	const playerWidth = width - 50;
	const playerHeight = (playerWidth / 16) * 9;

	return (
		<View
			style={{
				width: playerWidth,
				height: playerHeight,
				marginVertical: 16,
				alignSelf: 'center',
				overflow: 'hidden',
				borderRadius: 10,
			}}
		>
			<YoutubePlayer
				videoId={videoId}
				height={playerHeight}
				width={playerWidth}
				play={false}
				initialPlayerParams={{
					rel: false,
					iv_load_policy: 3,
					preventFullScreen: Platform.OS == 'android' ? true : false,
				}}
				webViewProps={{
					allowsInlineMediaPlayback: true,
					allowsFullscreenVideo: false,
				}}
			/>
		</View>
	);
};

export default WpYoutubeRenderer;
