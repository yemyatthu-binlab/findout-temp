import React, { useEffect } from 'react';
import Video from 'react-native-video';
import { extractMuxPlaybackId } from '@/util/helper/helper';

interface PreloadManagerProps {
	posts: Patchwork.WPStory[];
	currentIndex: number;
}

const PreloadManager: React.FC<PreloadManagerProps> = ({
	posts,
	currentIndex,
}) => {
	useEffect(() => {
		const indicesToPreload = [currentIndex + 1, currentIndex + 2];

		indicesToPreload.forEach(index => {
			if (index >= 0 && index < posts.length) {
				const post = posts[index];
				const playbackId = extractMuxPlaybackId(post.content.rendered);

				if (playbackId) {
					const uri = `https://stream.mux.com/${playbackId}.m3u8`;
					// Check if preload method exists in this version of RN Video (alpha/beta/v6+)
					// @ts-ignore
					if (Video.preload) {
						// @ts-ignore
						Video.preload(uri);
					}
				}
			}
		});
	}, [currentIndex, posts]);

	return null;
};

export default PreloadManager;
