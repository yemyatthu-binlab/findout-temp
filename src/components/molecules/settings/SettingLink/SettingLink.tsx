import { Pressable } from 'react-native';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { ChevronRightIcon } from '@/util/svg/icon.common';
import { useColorScheme } from 'nativewind';

interface SettingLinkProps {
	text: string;
	onPress: () => void;
}

export const SettingLink: React.FC<SettingLinkProps> = ({ text, onPress }) => {
	const { colorScheme } = useColorScheme();
	return (
		<Pressable
			className="ml-12 mr-2 mt-4 flex-row items-center justify-between active:opacity-80"
			onPress={onPress}
		>
			<ThemeText>{text}</ThemeText>
			<ChevronRightIcon width={12} height={12} colorScheme={colorScheme} />
		</Pressable>
	);
};
