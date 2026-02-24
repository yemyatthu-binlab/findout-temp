import { memo } from 'react';
import { View, Pressable } from 'react-native';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { HomeStackScreenProps } from '@/types/navigation';
import { ChevronRightIcon, ListsIcon } from '@/util/svg/icon.common';
import { generateAppopirateColor } from '@/util/helper/helper';
import { useColorScheme } from 'nativewind';

const MyListsItem = ({
	item,
	navigation,
}: {
	item: Patchwork.Lists;
	navigation: HomeStackScreenProps<'HomeFeed'>['navigation'];
}) => {
	const { colorScheme } = useColorScheme();
	return (
		<Pressable
			className="flex-row items-center justify-between mx-1.5 border-slate-200 dark:border-patchwork-light-100 border rounded-3xl px-3 py-1.5"
			onPress={() =>
				navigation.navigate('ListsStack', {
					screen: 'ListTimelines',
					params: {
						id: item.id,
						title: item.title,
					},
				})
			}
		>
			<View className="flex-row items-center">
				<ListsIcon fill={colorScheme === 'dark' ? '#fff' : '#000'} />
				<ThemeText className="ml-2">{item.title}</ThemeText>
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

export default memo(MyListsItem);
