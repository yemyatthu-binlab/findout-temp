import { View, Pressable } from 'react-native';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import { WarningFilledIcon } from '@/util/svg/icon.compose';
import colors from 'tailwindcss/colors';
import {
	forceHideStatus,
	toggleForceShowSpoilerTextCache,
} from '@/util/cache/feed/feedCache';
import { useStatusContext } from '@/context/statusItemContext/statusItemContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '@/types/navigation';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button } from '../../common/Button/Button';
import customColor from '@/util/constant/color';
import { useColorScheme } from 'nativewind';

type Props = {
	status: Patchwork.Status;
};

const SpoilerWarning = ({ status }: Props) => {
	const { colorScheme } = useColorScheme();
	const { currentPage } = useStatusContext();
	const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
	const handleShowContent = () => {
		toggleForceShowSpoilerTextCache(status, true);
	};
	const { t } = useTranslation();

	const handleHidePost = () => {
		if (currentPage && currentPage == 'FeedDetail') {
			navigation.goBack();
		}
		forceHideStatus(status);
	};

	return (
		<View className="bg-patchwork-primary/10 border-[2px] border-dotted border-patchwork-primary/50 dark:border-patchwork-primary-dark/50 rounded-md mt-1 overflow-hidden">
			<View className="flex-row items-start px-3 py-3">
				<View className="rounded-full mr-2">
					<WarningFilledIcon
						width={24}
						height={24}
						fill={
							colorScheme == 'dark' ? '#fff' : customColor['patchwork-primary']
						}
					/>
				</View>
				<View className="flex-1 flex-col">
					<ThemeText className="text-patchwork-primary dark:text-white font-NewsCycle_Bold text-base">
						{t('compose.spoiler_warning_title')}
					</ThemeText>
					<ThemeText className="text-patchwork-primary dark:text-white mt-0.5 text-sm leading-5">
						{t('compose.spoiler_warning_message', {
							spoiler_text: status.spoiler_text,
						})}
					</ThemeText>
				</View>
			</View>

			<View className="flex-row mt-1 items-center ml-4 mb-4">
				<Button
					onPress={handleShowContent}
					className="bg-patchwork-primary px-4 py-1.5 rounded-lg active:scale-95 active:opacity-80"
				>
					<ThemeText className="text-white dark:text-white text-xs font-bold">
						{t('compose.show_content')}
					</ThemeText>
				</Button>

				{/* <Pressable
					onPress={handleHidePost}
					className="border-2 border-red-300 dark:border-red-700 ml-3 px-4 py-2 rounded-lg active:scale-95 active:opacity-80"
				>
					<ThemeText className="text-red-700 dark:text-red-700 text-xs font-semibold">
						{t('compose.hide_post')}
					</ThemeText>
				</Pressable> */}
			</View>
		</View>
	);
};

export default SpoilerWarning;
