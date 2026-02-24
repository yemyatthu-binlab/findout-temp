import { Pressable, View } from 'react-native';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import { ChevronRightIcon } from '@/util/svg/icon.common';
import Image from '../../common/Image/Image';

type Props = {
	profile: Patchwork.ProfileAttributes | any;
	handlePress: () => void;
};

export const ProfileCard = ({ profile, handlePress }: Props) => {
	return (
		<Pressable
			className="rounded-md mr-3 items-center mb-3 w-32 h-32 active:opacity-90"
			onPress={handlePress}
		>
			<Image uri={profile?.avatar_image_url} className="w-32 h-32 rounded-md" />
			<View className="absolute bottom-0 bg-black opacity-30 w-32 h-32 rounded-md"></View>
			<View className="absolute bottom-2 mx-2 flex-row items-center">
				<ThemeText className="flex-1 font-Inter_Regular text-white">
					{profile?.display_name ?? profile?.name}
				</ThemeText>
				<ChevronRightIcon fill={'#fff'} />
			</View>
		</Pressable>
	);
};
export default ProfileCard;
