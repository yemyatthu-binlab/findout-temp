import { Pressable, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import HashtagsFollowingItem from '@/components/atoms/hashtagsFollowing/HashtagsFollowingItem/HashtagsFollowingItem';
import { useTranslation } from 'react-i18next';

type Props = {
	data: Patchwork.HashtagsFollowing[];
	onPressViewAll: () => void;
};

export const HashtagsFollowingSection = ({ data, onPressViewAll }: Props) => {
	const { t } = useTranslation();
	return (
		<View>
			<View className="flex-row items-center px-4">
				<ThemeText className="font-NewsCycle_Bold my-2 flex-1" size="lg_18">
					{t('hashtags')}
				</ThemeText>
				<Pressable onPress={onPressViewAll} className="active:opacity-80">
					<ThemeText variant="textGrey">{t('common.view_all')}</ThemeText>
				</Pressable>
			</View>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ paddingLeft: 16, marginBottom: 16 }}
			>
				{data.map(item => (
					<HashtagsFollowingItem key={item.name} item={item} />
				))}
			</ScrollView>
		</View>
	);
};
