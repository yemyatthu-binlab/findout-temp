import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';

const MenuOptionIcon = ({
	icon,
	name,
	disabled,
}: {
	icon: ReactNode;
	name: string;
	disabled?: boolean;
}) => {
	return (
		<View className="flex-row items-center">
			<View className="w-9 h-9 items-center justify-center">{icon}</View>
			<ThemeText
				size={'sm_14'}
				variant={disabled ? 'textGrey' : 'default'}
				className="font-Inter_Regular ml-1 text-black dark:text-white flex-1 flex-shrink"
				numberOfLines={2}
			>
				{name}
			</ThemeText>
		</View>
	);
};

export default MenuOptionIcon;
