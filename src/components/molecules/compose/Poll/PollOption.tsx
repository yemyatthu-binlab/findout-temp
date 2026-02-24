import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import TextInput from '@/components/atoms/common/TextInput/TextInput';
import { DeletePollOptionIcon } from '@/util/svg/icon.compose';
import { useColorScheme } from 'nativewind';
import customColor from '@/util/constant/color';
import { useTranslation } from 'react-i18next';

interface PollOptionProps {
	value: string;
	index: number;
	canRemove: boolean;
	onChangeText: (text: string, index: number) => void;
	onRemove: (index: number) => void;
}

const PollOption = ({
	value,
	index,
	canRemove,
	onChangeText,
	onRemove,
}: PollOptionProps) => {
	const { t } = useTranslation();
	const { colorScheme } = useColorScheme();
	return (
		<View className="flex-row items-center mb-3">
			<TextInput
				startIcon={
					<View className="border border-patchwork-dark-50 dark:border-patchwork-light-100 rounded-full w-4 h-4 top-1 left-1" />
				}
				endIcon={
					canRemove ? (
						<TouchableOpacity
							onPress={() => onRemove(index)}
							className="ml-3 -top-1"
						>
							<DeletePollOptionIcon
								stroke={
									colorScheme === 'dark'
										? customColor['patchwork-primary-dark']
										: customColor['patchwork-red-600']
								}
							/>
						</TouchableOpacity>
					) : (
						<></>
					)
				}
				extraContainerStyle="flex-1"
				placeholder={`${t('poll.option')} ${index + 1}`}
				placeholderTextColor={
					colorScheme === 'dark'
						? customColor['patchwork-grey-400']
						: customColor['patchwork-grey-100']
				}
				value={value}
				onChangeText={text => onChangeText(text, index)}
			/>
		</View>
	);
};

export default PollOption;
