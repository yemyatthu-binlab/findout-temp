import React from 'react';
import { View, ViewProps } from 'react-native';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { formatNumber } from '@/util/helper/helper';
import { useNavigation } from '@react-navigation/native';
import { CommonCompositeNavigationProp } from '@/types/navigation';
import { useTranslation } from 'react-i18next';

type UserStatsProps = {
	posts: number;
	following: number;
	followers: number;
	isMainChannel?: boolean;
	accountId: string;
	isUserFromSameServer: boolean;
	userAccHandle: string;
};

const UserStats = ({
	posts,
	following,
	followers,
	isMainChannel,
	accountId,
	isUserFromSameServer,
	userAccHandle,
	...props
}: UserStatsProps & ViewProps) => {
	const { t, i18n } = useTranslation();
	const navigation = useNavigation<CommonCompositeNavigationProp>();

	const isBurmese = i18n.language === 'my';
	const getTextStyle = () => (isBurmese ? { lineHeight: 32 } : {});

	return (
		<View className="flex-row px-4 pt-3 gap-3" {...props}>
			<ThemeText style={getTextStyle()} className="font-NewsCycle_Bold">
				{formatNumber(posts)}{' '}
				<ThemeText
					style={getTextStyle()}
					className="font-Inter_Regular text-slate-600 dark:text-patchwork-grey-400"
				>
					{t('timeline.post', { count: posts })}
				</ThemeText>
			</ThemeText>
			<ThemeText
				style={getTextStyle()}
				className="font-NewsCycle_Bold"
				onPress={() => {
					navigation.push('FollowingAccounts', {
						accountId,
						isMainChannel,
						isUserFromSameServer,
						userAccHandle,
					});
				}}
			>
				{formatNumber(following)}{' '}
				<ThemeText
					style={getTextStyle()}
					className="font-Inter_Regular text-slate-600 dark:text-patchwork-grey-400"
				>
					{t('timeline.following')}
				</ThemeText>
			</ThemeText>
			<ThemeText
				style={getTextStyle()}
				className="font-NewsCycle_Bold"
				onPress={() => {
					navigation.push('FollowerAccounts', {
						accountId,
						isMainChannel,
						isUserFromSameServer,
						userAccHandle,
					});
				}}
			>
				{formatNumber(followers)}{' '}
				<ThemeText
					style={getTextStyle()}
					className="font-Inter_Regular text-slate-600 dark:text-patchwork-grey-400"
				>
					{t('timeline.follower', { count: followers })}
				</ThemeText>
			</ThemeText>
		</View>
	);
};

export default UserStats;
