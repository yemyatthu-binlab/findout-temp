import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
	View,
	Pressable,
	StyleSheet,
	StatusBar,
	Platform,
	ActivityIndicator, Dimensions
} from 'react-native';
import Video, { ResizeMode, SelectedTrackType } from 'react-native-video';
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';
import { PlayIcon } from '@/util/svg/icon.common';
import FastImage from '@d11/react-native-fast-image';
import {
	extractMuxPlaybackId,
	extractYoutubeId,
	getInitialVideoOrientation,
} from '@/util/helper/helper';
import { LandscapeControls } from '../LiveVideoFeedPlayer/LandscapeControls';
import { PortraitControls } from '../LiveVideoFeedPlayer/PortraitControls';

interface WpPlayerProps {
	post: Patchwork.WPStory;
	isActive: boolean;
	isMuted: boolean;
	toggleMute: () => void;
	onAspectRatioLoad?: (isLandscape: boolean, aspectRatio: number) => void;
}

export const WpPlayer: React.FC<WpPlayerProps> = ({
	post,
	isActive,
	isMuted,
	toggleMute,
	onAspectRatioLoad,
}) => {
	const [shouldPlay, setShouldPlay] = useState(false);
	const initialOrientation = getInitialVideoOrientation(post);
	const youtubeId = extractYoutubeId(post.content?.rendered || '');
	const [aspectRatio, setAspectRatio] = useState(
		youtubeId ? 16 / 9 : initialOrientation.aspectRatio,
	);
	const muxPlaybackId = extractMuxPlaybackId(post.content?.rendered || '');
	const videoRef = useRef<any>(null);
	const youtubePlayerRef = useRef<YoutubeIframeRef>(null);
	const [paused, setPaused] = useState(true);
	const [resizeMode, setResizeMode] = useState<'cover' | 'contain'>('contain');
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [showSubtitles, setShowSubtitles] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!isActive) {
			setShouldPlay(false);
			setPaused(true);
		}
	}, [isActive]);

	const handlePlayPress = () => {
		setShouldPlay(true);
		setPaused(false);
	};

	const playbackId = muxPlaybackId;

	const videoSource = playbackId
		? { uri: `https://stream.mux.com/${playbackId}.m3u8` }
		: null;

	const posterSource = playbackId
		? {
				uri: `https://image.mux.com/${playbackId}/thumbnail.png?width=640&height=360&fit_mode=smart`,
		  }
		: null;

	const handleLoad = (data: any) => {
		const { width, height } = data.naturalSize || data;
		const isPortrait = height > width;
		setResizeMode(isPortrait ? 'cover' : 'contain');
		setDuration(data.duration);
		setShowSubtitles(!isPortrait);
		setIsLoading(false);

		if (width && height) {
			setAspectRatio(width / height);
		}

		if (onAspectRatioLoad) {
			onAspectRatioLoad(!isPortrait, width / height);
		}
	};

	const handleProgress = (data: any) => {
		setCurrentTime(data.currentTime);
	};

	const handleSeek = (time: number) => {
		if (videoRef.current) {
			videoRef.current.seek(time);
			setCurrentTime(time);
		}
	};

	const handleSkip = (seconds: number) => {
		if (videoRef.current) {
			const newTime = Math.max(0, Math.min(currentTime + seconds, duration));
			videoRef.current.seek(newTime);
			setCurrentTime(newTime);
		}
	};

	const handleTogglePlay = () => {
		setPaused(prev => !prev);
	};

	const handleFullscreen = () => {
		videoRef.current?.presentFullscreenPlayer();
	};

	const handleToggleSubtitles = () => {
		setShowSubtitles(prev => !prev);
	};

	const onFullScreenChange = useCallback(
		(isFullScreen: boolean) => {
			if (!isFullScreen && isActive) {
				setPaused(false);
			}
		},
		[isActive],
	);

	const handleLoadStart = () => {
		setIsLoading(true);
	};

	const thumbnailUrl = muxPlaybackId
		? `https://image.mux.com/${muxPlaybackId}/thumbnail.png?width=600`
		: youtubeId
		? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
		: post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

	const isLandscape = youtubeId ? true : resizeMode === 'contain';

	if (youtubeId && shouldPlay) {
		return (
			<View style={[styles.container, { aspectRatio: 16 / 9 }]}>
				<YoutubePlayer
					ref={youtubePlayerRef}
					height={Dimensions.get('window').width / (16 / 9)}
					play={isActive && !paused}
					videoId={youtubeId}
					onFullScreenChange={onFullScreenChange}
					webViewProps={{
						androidLayerType: 'hardware',
						renderToHardwareTextureAndroid: true,
					}}
				/>
			</View>
		);
	}

	return (
		<View style={[styles.container, { aspectRatio: aspectRatio }]}>
			{shouldPlay && videoSource ? (
				<View style={StyleSheet.absoluteFill}>
					<Video
						ref={videoRef}
						onLoadStart={handleLoadStart}
						source={videoSource}
						style={styles.video}
						paused={paused}
						muted={isMuted}
						poster={posterSource?.uri}
						resizeMode={resizeMode as ResizeMode}
						onLoad={handleLoad}
						onProgress={handleProgress}
						repeat={true}
						playInBackground={false}
						playWhenInactive={false}
						selectedTextTrack={{
							type: showSubtitles
								? SelectedTrackType.INDEX
								: SelectedTrackType.DISABLED,
							value: 0,
						}}
						bufferConfig={{
							minBufferMs: 15000,
							maxBufferMs: 50000,
							bufferForPlaybackMs: 2500,
							bufferForPlaybackAfterRebufferMs: 5000,
						}}
						onFullscreenPlayerWillDismiss={() => {
							if (Platform.OS === 'ios') {
								StatusBar.setHidden(false);
							}
						}}
						onFullscreenPlayerDidDismiss={() => {
							if (Platform.OS === 'ios') {
								StatusBar.setHidden(false);
							}
						}}
					/>

					{isLoading && (
						<View style={styles.loadingOverlay} pointerEvents="none">
							<ActivityIndicator size="large" color="white" />
						</View>
					)}

					{isLandscape ? (
						<LandscapeControls
							isPaused={paused}
							currentTime={currentTime}
							duration={duration}
							onTogglePlay={handleTogglePlay}
							onSeek={handleSeek}
							onSkip={handleSkip}
							onEnterFullscreen={handleFullscreen}
							onToggleSubtitles={handleToggleSubtitles}
							areSubtitlesEnabled={showSubtitles}
							isLoading={isLoading}
							isMuted={isMuted}
							onToggleMute={toggleMute}
						/>
					) : (
						<PortraitControls
							isActive={isActive}
							isPaused={paused}
							currentTime={currentTime}
							duration={duration}
							onPress={handleTogglePlay}
							onSeek={handleSeek}
						/>
					)}
				</View>
			) : (
				<>
					{thumbnailUrl ? (
						<FastImage
							source={{ uri: thumbnailUrl }}
							style={StyleSheet.absoluteFill}
							resizeMode={FastImage.resizeMode.cover}
						/>
					) : (
						<View
							style={[StyleSheet.absoluteFill, { backgroundColor: 'black' }]}
						/>
					)}

					<View style={[StyleSheet.absoluteFill, styles.overlay]}>
						<Pressable onPress={handlePlayPress} style={styles.playButton}>
							<PlayIcon width={30} height={30} fill="white" />
						</Pressable>
					</View>
				</>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		backgroundColor: 'black',
		overflow: 'hidden',
		position: 'relative',
	},
	loadingOverlay: {
		...StyleSheet.absoluteFillObject,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 20,
	},
	video: {
		flex: 1,
		width: '100%',
		height: '100%',
	},
	overlay: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.2)',
	},
	playButton: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: 'rgba(0,0,0,0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
});
