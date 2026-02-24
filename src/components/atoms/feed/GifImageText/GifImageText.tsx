import { ComposeGifIcon } from '@/util/svg/icon.compose';
import { View } from 'react-native';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import { useColorScheme } from 'nativewind';

const GifImageText = () => {
	const { colorScheme } = useColorScheme();
	return (
		<View className="flex-row items-center">
			<ComposeGifIcon {...{ colorScheme }} />
			<ThemeText className="ml-1" variant={'textGrey'}>
				GIF image
			</ThemeText>
		</View>
	);
};

export default GifImageText;
