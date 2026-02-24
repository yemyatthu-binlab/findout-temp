import { Pressable, View } from 'react-native';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import Underline from '../../common/Underline/Underline';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '@/types/navigation';
import { cn } from '@/util/helper/twutil';
import { useTranslation } from 'react-i18next';

export const StatusSocialCounts = ({
	status,
}: {
	status: Patchwork.Status;
}) => {
	const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
	const { t } = useTranslation();

	if (
		status.reblogs_count === 0 &&
		status.favourites_count === 0 &&
		status?.quotes_count === 0
	) {
		return null;
	}

	return (
		<>
			<View className="flex-row mb-2 mt-3">
				{status.reblogs_count > 0 && (
					<Pressable
						className="flex-row items-center py-1 pr-3 active:opacity-80"
						onPress={() => {
							navigation.navigate('BoostedBy', {
								id: status.id,
								uri: status.url,
							});
						}}
					>
						<ThemeText variant={'textGrey'}>
							{t('timeline.status.boost', { count: status.reblogs_count })}
						</ThemeText>
					</Pressable>
				)}
				{status.favourites_count > 0 && (
					<Pressable
						className="flex-row items-center py-1 pr-3 active:opacity-80"
						onPress={() =>
							navigation.navigate('FavoritedBy', {
								id: status.id,
								uri: status.url,
							})
						}
					>
						<ThemeText variant={'textGrey'}>
							{t('timeline.status.favorite', {
								count: status.favourites_count,
							})}
						</ThemeText>
					</Pressable>
				)}
				{status?.quotes_count > 0 && (
					<Pressable
						className="flex-row items-center py-1 pr-3 active:opacity-80"
						onPress={() =>
							navigation.navigate('QuotedBy', {
								id: status.id,
								uri: status.url,
							})
						}
					>
						<ThemeText variant={'textGrey'}>
							{t('timeline.status.quote', {
								count: status?.quotes_count,
							})}
						</ThemeText>
					</Pressable>
				)}
			</View>
			<Underline
				className={cn(status.visibility === 'direct' ? '-mx-2' : '-mx-5')}
			/>
		</>
	);
};
