import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'nativewind';
import TextInput from '@/components/atoms/common/TextInput/TextInput';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { CloseIcon } from '@/util/svg/icon.common';
import { LinkIcon } from '@/util/svg/icon.profile';

const CallToAction = ({ onClose }: { onClose: () => void }) => {
	const { colorScheme } = useColorScheme();
	return (
		<View className="flex-1 p-1">
			<View className="justify-center mb-2">
				<ThemeText size={'md_16'} className="text-center font-NewsCycle_Bold">
					Add call to action
				</ThemeText>
				<TouchableOpacity
					activeOpacity={0.8}
					className=" absolute right-0"
					onPress={onClose}
				>
					<CloseIcon {...{ colorScheme }} />
				</TouchableOpacity>
			</View>

			<TextInput
				placeholder="Enter your button text here"
				extraContainerStyle="h-11 my-3 mx-1"
			/>
			<TextInput
				placeholder="Enter link URL here"
				extraContainerStyle="h-11 my-3 mx-1"
				endIcon={<LinkIcon {...{ colorScheme }} />}
			/>
		</View>
	);
};

export default CallToAction;
