import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Pressable, View } from 'react-native';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import customColor from '@/util/constant/color';
import { cn } from '@/util/helper/twutil';
import { ChevronRightIcon } from '@/util/svg/icon.common';

interface SettingSectionProps {
	title: string;
	icon: IconProp;
	colorScheme: 'light' | 'dark';
	iconSize?: number;
	mt?: string;
	sectionKey: string;
	isOpen: boolean;
	onToggle: (section: string) => void;
}

export const SettingSection: React.FC<SettingSectionProps> = ({
	title,
	icon,
	colorScheme,
	iconSize = 20,
	mt = 'mt-4',
	sectionKey,
	isOpen,
	onToggle,
}) => {
	const iconColor = colorScheme === 'dark' ? '#fff' : '#000';

	return (
		<Pressable
			onPress={() => onToggle(sectionKey)}
			android_ripple={{ color: '#00000010' }}
		>
			<View
				className={cn(
					'flex-row justify-between items-center py-2 px-3 my-1 rounded-lg',
					mt,
				)}
			>
				<View className={cn('flex-row items-center flex-1')}>
					<View className="ml-1 mr-3">
						<FontAwesomeIcon icon={icon} size={iconSize} color={iconColor} />
					</View>
					<ThemeText className="font-Montserrat_SemiBold text-base">
						{title}
					</ThemeText>
				</View>
				<ChevronRightIcon
					width={12}
					height={12}
					style={{
						transform: [
							{
								rotate: isOpen ? '90deg' : '0deg',
							},
						],
					}}
					{...{ colorScheme }}
				/>
			</View>
		</Pressable>
	);
};
