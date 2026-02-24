import { memo, useState } from 'react';
import FastImage, { ImageStyle } from '@d11/react-native-fast-image';
import { Blurhash } from 'react-native-blurhash';
import type { StyleProp } from 'react-native';
import customColor from '@/util/constant/color';
import { useStatusContext } from '@/context/statusItemContext/statusItemContext';

export interface Props {
	url: string;
	blurHash?: string;
	imageStyle?: StyleProp<ImageStyle>;
}

const ThemeImage = memo(({ url, blurHash, imageStyle }: Props) => {
	const [imageLoaded, setImageLoaded] = useState(false);
	const { currentPage } = useStatusContext();

	const imageOnLoad = () => {
		setImageLoaded(true);
	};

	return (
		<>
			<FastImage
				source={{
					uri: url,
				}}
				style={[
					imageStyle,
					{ backgroundColor: customColor['patchwork-dark-50'] },
				]}
				onLoad={imageOnLoad}
			/>
			{blurHash && !imageLoaded && currentPage !== 'FeedDetail' && (
				<BlurHashComponent blurHash={blurHash} imageStyle={imageStyle} />
			)}
		</>
	);
});

const BlurHashComponent = ({
	blurHash,
	imageStyle,
}: {
	blurHash: string;
	imageStyle: StyleProp<ImageStyle>;
}) => {
	return (
		<Blurhash
			decodeAsync
			blurhash={blurHash}
			style={[{ position: 'absolute' }, imageStyle]}
		/>
	);
};

export default ThemeImage;
