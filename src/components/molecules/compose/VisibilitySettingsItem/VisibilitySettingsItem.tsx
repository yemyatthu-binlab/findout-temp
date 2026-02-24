import React from 'react';
import { View, Pressable } from 'react-native';
import { useColorScheme } from 'nativewind';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import {
	ComposeCircleCheckIcon,
	ComposePinIcon,
} from '@/util/svg/icon.compose';
import {
	SettingsItemProps,
	VisibilitySettingsProps,
} from '@/util/constant/visibilitySettings';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { AppIcons } from '@/util/icons/icon.common';

type VisibilitySettingsItemProps = {
	item: VisibilitySettingsProps | SettingsItemProps;
	isSelected: boolean;
	onPressVisibilitySettings: (val: any) => void;
	isDisabled?: boolean;
};

const VisibilitySettingsItem = ({
	item,
	isSelected,
	onPressVisibilitySettings,
	isDisabled = false,
}: VisibilitySettingsItemProps) => {
	const { colorScheme } = useColorScheme();

	return (
		<Pressable
			className="flex-row items-center py-3 px-4"
			onPress={() => onPressVisibilitySettings(item)}
			disabled={isDisabled}
			style={isDisabled ? { opacity: 0.5 } : undefined}
		>
			<View>
				{item.icon === 'public' ? (
					<FontAwesomeIcon
						icon={AppIcons.globe}
						size={17}
						color={colorScheme == 'dark' ? '#fff' : '#000'}
					/>
				) : item.icon === 'local' ? (
					<ComposePinIcon {...{ colorScheme }} />
				) : item.icon === 'unlisted' ? (
					<FontAwesomeIcon
						icon={AppIcons.unlock}
						size={17}
						color={colorScheme == 'dark' ? '#fff' : '#000'}
					/>
				) : item.icon === 'private' ? (
					<FontAwesomeIcon
						icon={AppIcons.lock}
						size={17}
						color={colorScheme == 'dark' ? '#fff' : '#000'}
					/>
				) : (
					<FontAwesomeIcon
						icon={AppIcons.mention}
						size={17}
						color={colorScheme == 'dark' ? '#fff' : '#000'}
					/>
				)}
			</View>
			<ThemeText className="flex-1 mx-3" size={'md_16'}>
				{item.label}
			</ThemeText>
			{isSelected && (
				<View className="ml-auto">
					<ComposeCircleCheckIcon colorScheme={colorScheme} />
				</View>
			)}
		</Pressable>
	);
};

export default VisibilitySettingsItem;
