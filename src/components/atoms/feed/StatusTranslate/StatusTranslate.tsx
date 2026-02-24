import React from 'react';
import { Pressable } from 'react-native';
import { StatusTranslateIcon } from '@/util/svg/icon.status_actions';
import customColor from '@/util/constant/color';
import { updateTranslateCache } from '@/util/cache/feed/feedCache';
import { useColorScheme } from 'nativewind';

type StatusTranslateProps = {
	status: Patchwork.Status;
	isFromNoti?: boolean;
};
const StatusTranslate = ({ status }: StatusTranslateProps) => {
	const { colorScheme } = useColorScheme();
	const onToggleTranslateStatus = () => {
		if (status.translated_text) {
			updateTranslateCache(
				status,
				{
					content: status.content,
					statusId: status.id,
				},
				false,
			);
		}
	};

	return (
		<Pressable className="mx-1" onPress={onToggleTranslateStatus}>
			<StatusTranslateIcon colorScheme={colorScheme} />
		</Pressable>
	);
};

export default StatusTranslate;
