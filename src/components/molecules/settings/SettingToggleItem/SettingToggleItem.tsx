import { Pressable, View } from 'react-native';
import { Flow } from 'react-native-animated-spinkit';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { SwitchOffIcon, SwitchOnIcon } from '@/util/svg/icon.common';
import customColor from '@/util/constant/color';
import { useColorScheme } from 'nativewind';

interface SettingToggleItemProps {
	text: string;
	isEnabled?: boolean; // Optional for loading state
	onToggle: (value: boolean) => void;
	isLoading?: boolean;
}

export const SettingToggleItem: React.FC<SettingToggleItemProps> = ({
	text,
	isEnabled,
	onToggle,
	isLoading = false,
}) => {
	const { colorScheme } = useColorScheme();

	const handleToggle = () => {
		if (isEnabled !== undefined && !isLoading) {
			onToggle(!isEnabled);
		}
	};

	return (
		<View className="ml-12 mr-2 mt-3 flex-row items-center justify-between">
			<Pressable
				onPress={handleToggle}
				className="flex-1 flex-row items-center"
			>
				<ThemeText className="mr-5">{text}</ThemeText>
			</Pressable>
			{isLoading || isEnabled === undefined ? (
				<Flow
					size={25}
					color={
						colorScheme == 'dark'
							? customColor['patchwork-primary-dark']
							: customColor['patchwork-primary']
					}
				/>
			) : isEnabled ? (
				<SwitchOnIcon width={42} onPress={() => onToggle(false)} />
			) : (
				<SwitchOffIcon width={42} onPress={() => onToggle(true)} />
			)}
		</View>
	);
};
