import { MediaState } from '@/store/profile/useProfileMediaStore';
import { AppIcons } from '@/util/icons/icon.common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { Pressable, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import { Asset } from 'react-native-image-picker';

interface HeaderMediaProps {
	header: MediaState;
	actions: {
		onToggleMediaModal: (type: 'header' | 'avatar') => void;
		onSelectMedia: (type: 'header' | 'avatar', media: Asset[] | string) => void;
	};
}

const HeaderMedia: React.FC<HeaderMediaProps> = ({ header, actions }) => (
	<View className="">
		<FastImage
			className="bg-patchwork-grey-400 dark:bg-patchwork-dark-50 h-36 w-full"
			source={{
				uri:
					typeof header.selectedMedia === 'string'
						? header?.selectedMedia
						: header?.selectedMedia[0]?.uri,
				priority: FastImage.priority.normal,
			}}
			resizeMode={FastImage.resizeMode.cover}
		/>
		<View className="absolute inset-0 bg-black/10 dark:bg-black/20" />
		<Pressable
			onPress={() => actions.onToggleMediaModal('header')}
			className="active:opacity-70 absolute z-30 bg-white/90 dark:bg-patchwork-dark-300 rounded-full w-9 h-9 justify-center items-center bottom-3 right-4 shadow-md"
		>
			<FontAwesomeIcon icon={AppIcons.coverPhoto} size={20} />
		</Pressable>
	</View>
);

export default HeaderMedia;
