import { View } from 'react-native';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import {
	NotificationFilledIcon,
	NotificationOutlineIcon,
} from '@/util/svg/icon.common';

type NotiTabBarIconProps = {
	colorScheme: 'light' | 'dark';
	focused: boolean;
	notiCount: number;
};
const NotiTabBarIcon = ({
	colorScheme,
	focused,
	notiCount,
}: NotiTabBarIconProps) => {
	return (
		<View className="relative">
			{focused ? (
				<NotificationFilledIcon colorScheme={colorScheme} />
			) : (
				<NotificationOutlineIcon colorScheme={colorScheme} />
			)}

			{notiCount > 0 && (
				<View className="absolute -top-3 -right-3 z-20 w-5 h-5 rounded-full items-center justify-center bg-patchwork-primary dark:bg-patchwork-primary-dark">
					<ThemeText size={'xs_12'} className="text-white dark:text-white">
						{notiCount > 99 ? 99 : notiCount}
					</ThemeText>
				</View>
			)}
		</View>
	);
};

export default NotiTabBarIcon;
