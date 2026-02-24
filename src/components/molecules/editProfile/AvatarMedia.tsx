import Image from '@/components/atoms/common/Image/Image';
import { useAuthStore } from '@/store/auth/authStore';
import { MediaState } from '@/store/profile/useProfileMediaStore';
import customColor from '@/util/constant/color';
import { cn } from '@/util/helper/twutil';
import { ComposeCameraIcon } from '@/util/svg/icon.compose';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Pressable, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import { Asset } from 'react-native-image-picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { AppIcons } from '@/util/icons/icon.common';

interface AvatarMediaProps {
	avatar: MediaState;
	actions: {
		onToggleMediaModal: (type: 'header' | 'avatar') => void;
		onSelectMedia: (type: 'header' | 'avatar', media: Asset[] | string) => void;
	};
}

const AvatarMedia: React.FC<AvatarMediaProps> = ({ avatar, actions }) => {
	const { colorScheme } = useColorScheme();
	const { userInfo } = useAuthStore();
	const defaultAvatarBgColor =
		colorScheme === 'dark'
			? customColor['patchwork-primary-dark'].replace('#', '')
			: customColor['patchwork-primary'].replace('#', '');

	// const missingImageUri =
	// 	typeof avatar.selectedMedia === 'string' &&
	// 	avatar.selectedMedia.includes('avatars/original/missing.png') &&
	// 	`https://ui-avatars.com/api/?name=${encodeURIComponent(
	// 		userInfo?.display_name || userInfo?.username || 'User',
	// 	)}&size=128&background=${defaultAvatarBgColor}&color=${
	// 		colorScheme === 'dark' ? '000000' : 'ffffff'
	// 	}`;

	return (
		<View className="mx-auto">
			<Pressable
				className="p-1 "
				onPress={() => actions.onToggleMediaModal('avatar')}
			>
				<View className="z-10 absolute bottom-2 right-2 rounded-full bg-slate-50 p-1.5">
					<FontAwesomeIcon icon={AppIcons.camera} size={20} />
				</View>
				<FastImage
					className={cn(
						'w-[100] h-[100] mt-[-25] bg-patchwork-dark-50 border-white dark:border-patchwork-dark-100 border-2 rounded-full',
					)}
					source={{
						uri:
							typeof avatar.selectedMedia === 'string'
								? avatar?.selectedMedia
								: avatar?.selectedMedia[0]?.uri,
						priority: FastImage.priority.normal,
					}}
					resizeMode={FastImage.resizeMode.cover}
				/>
			</Pressable>
		</View>
	);
};

export default AvatarMedia;
