import { useGetConversationsList } from '@/hooks/queries/conversations.queries';

import { useColorScheme } from 'nativewind';
import { useMemo } from 'react';
import { View } from 'react-native';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { AppIcons } from '@/util/icons/icon.common';
import customColor from '@/util/constant/color';

const ConversationsTabButton = ({ focused }: { focused: boolean }) => {
	const { colorScheme } = useColorScheme();
	const { data } = useGetConversationsList();

	const unreadCount = useMemo(() => {
		return data?.pages.flat().filter(item => item.unread === true).length ?? 0;
	}, [data]);

	return (
		<View className="relative">
			<FontAwesomeIcon
				icon={
					focused ? AppIcons.conversationSolid : AppIcons.conversationRegular
				}
				size={23}
				color={colorScheme === 'dark' ? '#fff' : '#000'}
			/>
			{unreadCount > 0 && (
				<View className="absolute -top-3 -right-3 z-20 w-5 h-5 rounded-full items-center justify-center bg-patchwork-primary dark:bg-patchwork-primary-dark">
					<ThemeText size={'xs_12'} className="text-white dark:text-white">
						{unreadCount > 99 ? '99+' : unreadCount}
					</ThemeText>
				</View>
			)}
		</View>
	);
};

export default ConversationsTabButton;
