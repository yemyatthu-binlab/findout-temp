import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import { ChevronRightIcon } from '@/util/svg/icon.common';
import { useColorScheme } from 'nativewind';

type Props = {
	icon?: React.ReactNode;
	label: string;
	value?: string;
	onPress?: () => void;
	actionComponent?: React.ReactElement;
};

const MyInfoItem: React.FC<Props> = ({ icon, label, onPress, value }) => {
	const { colorScheme } = useColorScheme();
	return (
		<Pressable className="flex-row mx-5 my-2" onPress={onPress}>
			<View className="flex-row items-center mr-3">
				{icon}
				<ThemeText className="ml-3">{label}</ThemeText>
			</View>
			<View className="flex-1 flex-row justify-end items-center active:opacity-80">
				<ThemeText
					variant={value ? 'textPrimary' : 'default'}
					className="text-right break-words ml-8"
				>
					{value || 'None'}
				</ThemeText>
				<ChevronRightIcon
					width={14}
					height={14}
					className="mt-[1] ml-2"
					{...{ colorScheme }}
				/>
			</View>
		</Pressable>
	);
};

export default MyInfoItem;
