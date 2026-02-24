import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import Underline from '@/components/atoms/common/Underline/Underline';
import {
	PollRadioCheckedIcon,
	PollRadioOutlined,
} from '@/util/svg/icon.common';
import React from 'react';
import { View, FlatList, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';

const ReportContentData = ({
	selectedCategory,
	handleCategoryChange,
}: {
	selectedCategory: string;
	handleCategoryChange: (category: string) => void;
}) => {
	const { t } = useTranslation();

	// Localized data directly from t() using keys
	const reportContentData = [
		{
			category: 'spam',
			title: t('report.category.spam.title'),
			desc: t('report.category.spam.desc'),
		},
		{
			category: 'legal',
			title: t('report.category.legal.title'),
			desc: t('report.category.legal.desc'),
		},
		{
			category: 'violation',
			title: t('report.category.violation.title'),
			desc: t('report.category.violation.desc'),
		},
		{
			category: 'other',
			title: t('report.category.other.title'),
			desc: t('report.category.other.desc'),
		},
	];

	return (
		<View className="mt-3">
			<ThemeText className="opacity-80">
				{t('report.choose_best_match')}
			</ThemeText>
			<FlatList
				data={reportContentData}
				showsVerticalScrollIndicator={false}
				ItemSeparatorComponent={() => (
					<Underline className="dark:border-zinc-600" />
				)}
				renderItem={({ item }) => (
					<Pressable
						key={item.category}
						className="flex-row items-center py-3"
						onPress={() => handleCategoryChange(item.category)}
					>
						<View>
							{item.category === selectedCategory ? (
								<PollRadioCheckedIcon />
							) : (
								<PollRadioOutlined />
							)}
						</View>
						<View className="ml-3">
							<ThemeText className="font-Inter_Regular">{item.title}</ThemeText>
							<ThemeText size="xs_12" className="opacity-70">
								{item.desc}
							</ThemeText>
						</View>
					</Pressable>
				)}
			/>
		</View>
	);
};

export default ReportContentData;
