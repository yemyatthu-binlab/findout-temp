import Image from '@/components/atoms/common/Image/Image';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { useAuthStore } from '@/store/auth/authStore';
import { appendInstance } from '@/util/helper/appendInstance';
import { cleanText } from '@/util/helper/cleanText';
import { extractMessage } from '@/util/helper/extractMessage';
import { getDurationFromNow } from '@/util/helper/getDurationFromNow';
import { getInstanceName } from '@/util/helper/getInstanceName';
import { cn } from '@/util/helper/twutil';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';

interface ListItemProps {
	item: Patchwork.NotiReq;
	onPressAccept: (id: string) => void;
	onPressCancel: (id: string) => void;
}

const NotiReqItem: React.FC<ListItemProps> = ({
	item,
	onPressAccept,
	onPressCancel,
}) => {
	const { t } = useTranslation();
	const { colorScheme } = useColorScheme();
	const { userOriginInstance } = useAuthStore();
	const defaultInstance = getInstanceName(userOriginInstance);

	return (
		<View className="flex-row p-3 mr-2">
			<Image
				className="w-14 h-14 rounded-full mr-3"
				resizeMode={FastImage.resizeMode.contain}
				uri={item.account.avatar}
			/>
			<View className="flex-1 mr-3">
				<View className="flex-row items-center">
					<ThemeText emojis={item.account.emojis} variant={'textPrimary'}>
						{item.account.display_name || item.account.username}
					</ThemeText>
					<ThemeText className="text-patchwork-grey-400 ml-3">
						{item.last_status
							? getDurationFromNow(item.last_status.created_at)
							: ''}
					</ThemeText>
				</View>
				<ThemeText size={'fs_13'} className="text-patchwork-grey-400 my-0.5">
					{appendInstance(`@${item.account.acct}`, defaultInstance)}
				</ThemeText>
				<ThemeText className={`w-full`} numberOfLines={1} ellipsizeMode="tail">
					{extractMessage(cleanText(item.last_status?.content))}
				</ThemeText>
				<View className="flex-row mt-3 justify-end">
					<Pressable
						onPress={() => onPressCancel(item.id)}
						className="border-slate-300 border px-5 py-1 rounded-lg"
					>
						<ThemeText>{t('common.cancel')}</ThemeText>
					</Pressable>
					<Pressable
						onPress={() => onPressAccept(item.id)}
						className="bg-patchwork-primary dark:bg-patchwork-primary-dark px-5 py-1.5 rounded-lg ml-3"
					>
						<ThemeText className="text-white">{t('common.accept')}</ThemeText>
					</Pressable>
				</View>
			</View>
		</View>
	);
};

export default NotiReqItem;
