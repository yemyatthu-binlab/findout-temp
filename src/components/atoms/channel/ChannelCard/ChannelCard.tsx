import { Pressable, View } from 'react-native';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import FastImage from '@d11/react-native-fast-image';
import { ChevronRightIcon } from '@/util/svg/icon.common';
import { useActiveDomainAction } from '@/store/feed/activeDomain';
import { useNavigation } from '@react-navigation/native';
import Image from '../../common/Image/Image';

type Props = {
	channel: Patchwork.ChannelAttributes;
	handlePress: () => void;
};
export const ChannelCard = ({ channel, handlePress }: Props) => {
	return (
		<Pressable className="mb-5 active:opacity-90" onPress={handlePress}>
			<Image
				className="w-full h-56 rounded-md"
				uri={channel.avatar_image_url}
				resizeMode={'cover'}
			/>
			<View className="absolute bottom-0 bg-black opacity-30 w-full h-56 rounded-md"></View>
			<View className="absolute bottom-2 mx-2 flex-row items-center">
				<ThemeText className="flex-1 font-Inter_Regular">
					{channel.name}
				</ThemeText>
				<ChevronRightIcon />
			</View>
		</Pressable>
	);
};
export default ChannelCard;
