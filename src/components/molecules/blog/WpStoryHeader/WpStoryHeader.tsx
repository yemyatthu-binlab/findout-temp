import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import he from 'he';
import BackButton from '@/components/atoms/common/BackButton/BackButton';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { StatusShareIcon } from '@/util/svg/icon.status_actions';
import customColor from '@/util/constant/color';
import colors from 'tailwindcss/colors';

interface WpStoryHeaderProps {
	title: string;
	onShare: () => void;
}

const WpStoryHeader = ({ title, onShare }: WpStoryHeaderProps) => {
	const { top: safeAreaTop } = useSafeAreaInsets();
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';
	const solidHeaderBg = isDark ? customColor['patchwork-dark-100'] : 'white';
	const textColor = isDark ? 'white' : 'black';

	return (
		<View
			style={{
				paddingTop: safeAreaTop,
				backgroundColor: solidHeaderBg,
				borderBottomWidth: 1,
				borderBottomColor: isDark ? colors.zinc[800] : colors.gray[200],
			}}
			className="pb-3 px-4 z-10"
		>
			<View className="flex-row items-center justify-between">
				<BackButton />

				<ThemeText
					numberOfLines={1}
					className="flex-1 text-center font-NewsCycle_Bold text-lg mx-4"
				>
					{he.decode(title || '')}
				</ThemeText>

				<Pressable
					onPress={onShare}
					className="w-10 h-10 items-center justify-center rounded-full active:opacity-60"
				>
					<StatusShareIcon
						colorScheme={colorScheme}
						width={20}
						height={20}
						stroke={textColor}
					/>
				</Pressable>
			</View>
		</View>
	);
};

export default WpStoryHeader;
