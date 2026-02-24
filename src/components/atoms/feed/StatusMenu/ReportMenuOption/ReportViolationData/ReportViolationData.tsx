import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import Underline from '@/components/atoms/common/Underline/Underline';
import { violationData } from '@/util/constant/reportItem';
import { CheckboxOutlined, CheckboxSolid } from '@/util/svg/icon.common';
import React from 'react';
import { View, FlatList, Pressable } from 'react-native';

const ReportViolationData = ({
	selectedViolationItem,
	handleCheckboxChange,
}: {
	selectedViolationItem: string[];
	handleCheckboxChange: (value: string) => void;
}) => {
	return (
		<View className="mt-3">
			<ThemeText size={'md_16'} className="opacity-80">
				Select all that apply
			</ThemeText>
			<FlatList
				data={violationData}
				showsVerticalScrollIndicator={false}
				ItemSeparatorComponent={() => (
					<Underline className="dark:border-patchwork-grey-400" />
				)}
				renderItem={({ item }) => (
					<Pressable
						key={item.text}
						className="flex-row items-center py-3"
						onPress={() => handleCheckboxChange(item.value)}
					>
						<View>
							{selectedViolationItem.includes(item.value) ? (
								<CheckboxSolid />
							) : (
								<CheckboxOutlined />
							)}
						</View>
						<View className="ml-3">
							<ThemeText size={'md_16'} className="font-Inter_Regular">
								{item.text}
							</ThemeText>
						</View>
					</Pressable>
				)}
			/>
		</View>
	);
};

export default ReportViolationData;
