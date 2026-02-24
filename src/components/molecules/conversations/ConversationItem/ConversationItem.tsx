import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import ConversationImage from '@/components/atoms/conversations/ConversationImage/ConversationImage';
import { useAuthStore } from '@/store/auth/authStore';
import { appendInstance } from '@/util/helper/appendInstance';
import { cleanText } from '@/util/helper/cleanText';
import { extractMessage } from '@/util/helper/extractMessage';
import { getDurationFromNow } from '@/util/helper/getDurationFromNow';
import { getInstanceName } from '@/util/helper/getInstanceName';
import { removePrivateConvoHashtag } from '@/util/helper/handlePrivateConvoHashtag';
import { truncateStr } from '@/util/helper/helper';
import { NotificationStatusImagesIcon } from '@/util/svg/icon.notification';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

interface ListItemProps {
	item: Patchwork.Conversations;
	userInfoId: string;
	onPress: (id: string) => void;
}

const ConversationItem: React.FC<ListItemProps> = ({
	item,
	onPress,
	userInfoId,
}) => {
	const { t } = useTranslation();
	const { userOriginInstance } = useAuthStore();
	const defaultInstance = getInstanceName(userOriginInstance);
	const isGroupChat = item.accounts?.length > 1;

	return (
		<Pressable
			onPress={() => onPress(item.id)}
			className="flex-row items-center bg-white dark:bg-patchwork-dark-100 p-3 mr-2 ml-2"
		>
			<ConversationImage accounts={item.accounts} />
			<View className="flex-1 mr-6">
				<View className="flex-row items-center justify-between">
					{isGroupChat ? (
						<View className="flex-row items-center flex-wrap">
							{item.accounts.map((acc, idx) => {
								if (idx == 2) {
									return (
										<ThemeText key={idx}>
											{' '}
											+ {item.accounts.length - 2}
										</ThemeText>
									);
								}
								if (idx > 2) return <View key={idx}></View>;
								return (
									<ThemeText
										emojis={acc.emojis}
										key={idx}
										className="text-patchwork-primary dark:text-patchwork-primary-dark"
									>
										{acc.display_name || acc.username}
										{idx !== item.accounts.length - 1 ? ', ' : ''}
									</ThemeText>
								);
							})}
						</View>
					) : (
						<ThemeText
							emojis={item.accounts[0].emojis}
							className="text-patchwork-primary dark:text-patchwork-primary-dark"
						>
							{item.accounts[0].display_name || item.accounts[0].username}
						</ThemeText>
					)}

					<ThemeText className="text-patchwork-grey-400 ml-3 -mr-6">
						{item.last_status
							? getDurationFromNow(item.last_status.created_at)
							: ''}
					</ThemeText>
				</View>
				<ThemeText size={'fs_13'} className="text-patchwork-grey-400 my-0.5">
					{appendInstance(`@${item.accounts[0].acct}`, defaultInstance)}
				</ThemeText>
				<View className="flex-row items-center">
					<ThemeText>
						{truncateStr(
							item.last_status?.account?.id === userInfoId
								? t('conversation.you') + ': '
								: (item.last_status?.account?.display_name ||
										item.last_status?.account?.username) + ': ',
							10,
						)}
					</ThemeText>
					{item?.last_status?.media_attachments?.length > 0 ? (
						<View className="flex-row items-center justify-center mt-[2]">
							<NotificationStatusImagesIcon width={25} height={25} />
							<ThemeText>
								{t('conversation.media_attachment', {
									count: item?.last_status?.media_attachments?.length || 0,
								})}
							</ThemeText>
						</View>
					) : (
						<ThemeText
							emojis={item.last_status?.emojis}
							className={`flex-shrink flex-1 ${
								item.unread ? 'font-NewsCycle_Bold' : 'font-normal'
							}`}
							numberOfLines={1}
							ellipsizeMode="tail"
						>
							{removePrivateConvoHashtag(
								extractMessage(cleanText(item.last_status?.content)),
							)}
						</ThemeText>
					)}
				</View>
			</View>
			{item.unread && (
				<View className="w-2 h-2 bg-patchwork-primary dark:bg-patchwork-primary-dark rounded-full mr-2" />
			)}
		</Pressable>
	);
};

export default ConversationItem;
