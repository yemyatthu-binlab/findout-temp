import { Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeStackScreenProps } from '@/types/navigation';
import MyListsItem from '@/components/atoms/lists/MyListsItem/MyListsItem';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { PlusIcon } from '@/util/svg/icon.conversations';
import { generateAppopirateColor } from '@/util/helper/helper';
import { useTranslation } from 'react-i18next';

type Props = {
	data: Patchwork.Lists[] | undefined;
	onPressViewAll: () => void;
};

export const MyListsSection = ({ data, onPressViewAll }: Props) => {
	const { t } = useTranslation();
	const navigation =
		useNavigation<HomeStackScreenProps<'HomeFeed'>['navigation']>();
	return (
		<View className="pb-4">
			<View className="flex-row items-center px-4">
				<ThemeText className="font-NewsCycle_Bold my-2 flex-1" size="lg_18">
					{t('my_lists')}
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
				<>
					<Pressable
						onPress={() => {
							navigation.navigate('ListsStack', {
								screen: 'UpsertList',
								params: { type: 'create' },
							});
						}}
						className="dark:border-white border-slate-200 border rounded-3xl p-2 mx-2 flex-row items-center justify-center"
					>
						<PlusIcon
							fill={generateAppopirateColor({ light: '#000', dark: '#fff' })}
							width={15}
							height={15}
							className="mr-1"
						/>
						<ThemeText className="mr-2">{t('create_new_list')}</ThemeText>
					</Pressable>
					{data &&
						data
							.slice(0, 9)
							.map(item => (
								<MyListsItem
									key={item.id.toString()}
									item={item}
									navigation={navigation}
								/>
							))}
				</>
			</ScrollView>
		</View>
	);
};
