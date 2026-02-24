import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { isTablet } from '@/util/helper/isTablet';
import { cn } from '@/util/helper/twutil';
import { View, Text, Pressable } from 'react-native';

interface SectionHeaderProps {
	title: string;
	onViewAll?: () => void;
}

const WpSectionHeader = ({ title, onViewAll }: SectionHeaderProps) => (
	<View className="flex-row items-center justify-between mb-4 mt-6">
		<ThemeText
			className={cn('text-lg font-NewsCycle_Bold', isTablet && 'text-xl')}
		>
			{title}
		</ThemeText>
		<Pressable onPress={onViewAll} className="active:opacity-80">
			<ThemeText className="text-sm text-gray-600 dark:text-gray-300">
				View all
			</ThemeText>
		</Pressable>
	</View>
);

export default WpSectionHeader;
