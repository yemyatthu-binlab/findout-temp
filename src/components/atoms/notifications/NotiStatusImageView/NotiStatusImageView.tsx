import React from 'react';
import { View } from 'react-native';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import { NotificationStatusImagesIcon } from '@/util/svg/icon.notification';

const NotiStatusImageView = ({ status }: { status: Patchwork.Status }) => {
	const mediaAttachmentCounts = status?.media_attachments?.length;
	return (
		<View className=" flex-row -ml-2 -mb-1 items-center">
			<View className="w-8 h-8">
				<NotificationStatusImagesIcon />
			</View>
			<ThemeText className="opacity-80">
				{status.media_attachments.length > 1
					? `${mediaAttachmentCounts} attachments`
					: `${mediaAttachmentCounts} attachment`}
			</ThemeText>
		</View>
	);
};

export default NotiStatusImageView;
