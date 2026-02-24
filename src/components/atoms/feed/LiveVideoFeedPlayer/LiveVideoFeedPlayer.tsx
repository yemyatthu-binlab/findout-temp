import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Video, { ResizeMode, SelectedTrackType } from 'react-native-video';
import { extractMuxPlaybackId } from '@/util/helper/helper';
import { PortraitControls } from './PortraitControls';
import { LandscapeControls } from './LandscapeControls';

interface VideoPlayerProps {
	post: Patchwork.WPStory;
	isActive: boolean;
	isMuted: boolean;
	toggleMute: () => void;
	onAspectRatioLoad?: (isLandscape: boolean, aspectRatio: number) => void;
	isCommentMode?: boolean;
	children?: React.ReactNode;
}

export const LiveVideoFeedPlayer: React.FC<VideoPlayerProps> = ({
	post,
	isActive,
	isMuted,
	toggleMute,
	onAspectRatioLoad,
	isCommentMode = false,
	children,
}) => {
	const videoRef = useRef<any>(null);
	const [paused, setPaused] = useState(!isActive);
	const [resizeMode, setResizeMode] = useState<'cover' | 'contain'>('contain');
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [showSubtitles, setShowSubtitles] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const playbackId = extractMuxPlaybackId(post.content.rendered);

	useEffect(() => {
		setPaused(!isActive);
	}, [isActive]);

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

	const handleLoadStart = () => {
		setIsLoading(true);
	};

	if (!videoSource) return <View style={styles.container} />;

	const isLandscape = resizeMode === 'contain';

	return (
		<View style={styles.container}>
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
			/>
			{isLoading && (
				<View style={styles.loadingOverlay} pointerEvents="none">
					<ActivityIndicator size="large" color="white" />
				</View>
			)}

			{!isCommentMode &&
				(isLandscape ? (
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
					>
						{children}
					</PortraitControls>
				))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		backgroundColor: 'black',
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
});
