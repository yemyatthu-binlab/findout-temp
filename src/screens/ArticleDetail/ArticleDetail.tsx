import React, { useMemo } from 'react';
import { ScrollView, View, useWindowDimensions, Pressable } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import Image from '@/components/atoms/common/Image/Image';
import customColor from '@/util/constant/color';
import moment from 'moment';
import { HomeStackScreenProps } from '@/types/navigation';
import { extractArticlePreview } from '@/util/helper/helper';
import BackButton from '@/components/atoms/common/BackButton/BackButton';
import Header from '@/components/atoms/common/Header/Header';
import { useTranslation } from 'react-i18next';
import { getTagsStyles } from '@/util/constant/article';

const ArticleDetail = ({ route }: HomeStackScreenProps<'ArticleDetail'>) => {
	const { t } = useTranslation();
	const { status } = route.params;
	const { width } = useWindowDimensions();
	const navigation = useNavigation();
	const { colorScheme } = useColorScheme();
	const { title } = extractArticlePreview(status.content);
	const coverImage = status.media_attachments?.[0]?.url;

	const isDark = colorScheme === 'dark';
	const baseTextColor = isDark ? 'white' : customColor['patchwork-dark-100'];
	const secondaryTextColor = isDark
		? customColor['patchwork-grey-400']
		: '#6B7280';
	const linkColor =
		colorScheme === 'dark'
			? customColor['patchwork-primary-dark']
			: customColor['patchwork-primary'];

	const tagsStyles = useMemo(
		() => getTagsStyles({ baseTextColor, linkColor, secondaryTextColor }),
		[baseTextColor, linkColor, secondaryTextColor],
	);

	return (
		<SafeScreen>
			<Header
				title={t('screen.article')}
				leftCustomComponent={<BackButton />}
			/>
			<ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
				{coverImage && (
					<Image
						source={{ uri: coverImage }}
						className="w-full h-56 bg-gray-200 dark:bg-gray-600"
						resizeMode="cover"
					/>
				)}

				<View className="p-4">
					<ThemeText className="text-3xl font-NewsCycle_Bold leading-tight mb-4 mt-2">
						{title}
					</ThemeText>
					<View className="flex-row items-center mt-2 mb-6">
						<Image
							source={{ uri: status.account.avatar }}
							className="w-12 h-12 rounded-full"
						/>
						<View className="ml-3">
							<ThemeText className="font-Inter_SemiBold">
								{status.account.display_name}
							</ThemeText>
							<ThemeText className="text-sm text-gray-500 dark:text-gray-400">
								{moment(status.created_at).fromNow()}
							</ThemeText>
						</View>
					</View>

					<RenderHTML
						contentWidth={width - 32}
						source={{ html: status.content }}
						tagsStyles={tagsStyles}
						baseStyle={{ color: baseTextColor }}
					/>
					<ThemeText className="mb-2 font-NewsCycle_Bold font-NewsCycle_Bold">
						Fedeverse Reaction
					</ThemeText>
					<View className="flex-row items-center">
						<View className="rounded-full bg-patchwork-primary w-8 h-8 justify-center border border-white">
							<ThemeText className="text-white text-center">S</ThemeText>
						</View>
						<View className="rounded-full bg-yellow-400 w-8 h-8 justify-center -ml-2 border border-white">
							<ThemeText className="text-white text-center">A</ThemeText>
						</View>
						<View>
							<ThemeText className="text-center ml-2 text-gray-400 text-xs">
								2 reposts
							</ThemeText>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeScreen>
	);
};

export default ArticleDetail;
