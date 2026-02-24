import { memo } from 'react';
import { View, Pressable } from 'react-native';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { HomeStackScreenProps } from '@/types/navigation';
import { ChevronRightIcon } from '@/util/svg/icon.common';
import { useNavigation } from '@react-navigation/native';
import { useSelectedDomain } from '@/store/feed/activeDomain';
import { generateAppopirateColor } from '@/util/helper/helper';
import colors from 'tailwindcss/colors';
import { useColorScheme } from 'nativewind';

const HashtagsFollowingItem = ({
	item,
}: {
	item: Patchwork.HashtagsFollowing;
}) => {
	const navigation =
		useNavigation<HomeStackScreenProps<'HomeFeed'>['navigation']>();
	const domain_name = useSelectedDomain();
	const { colorScheme } = useColorScheme();

	return (
		<Pressable
			className="flex-row items-center justify-between mx-1.5 border-slate-200 dark:border-patchwork-light-100 border rounded-3xl px-3 py-1.5"
			onPress={() =>
				navigation.navigate('HashTagDetail', {
					hashtag: item.name,
					hashtagDomain: domain_name,
				})
			}
		>
			<View className="flex-row items-center">
				<ThemeText className="ml-2">#{item.name}</ThemeText>
			</View>
			<View className="ml-3">
				<ChevronRightIcon
					width={12}
					height={12}
					fill={colorScheme === 'dark' ? '#fff' : '#000'}
				/>
			</View>
		</Pressable>
	);
};

export default memo(HashtagsFollowingItem);
