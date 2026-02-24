import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { SearchIcon } from '@/util/svg/icon.common';
import { useColorScheme } from 'nativewind';
import { Keyboard, Platform, Pressable, View } from 'react-native';
import TextInput from '@/components/atoms/common/TextInput/TextInput';
import { StackNavigationProp } from '@react-navigation/stack';
import { SearchStackParamList } from '@/types/navigation';
import { useActiveDomainAction } from '@/store/feed/activeDomain';
import Image from '@/components/atoms/common/Image/Image';
import { useTranslation } from 'react-i18next';

type Props = {
	navigation: StackNavigationProp<
		SearchStackParamList,
		'SearchFeed',
		undefined
	>;
	account: Patchwork.Account;
	showUnderLine?: boolean;
	acitveIndex: number;
};

const SearchFeedHeader = ({
	navigation,
	account,
	showUnderLine = true,
	acitveIndex,
}: Props) => {
	const { colorScheme } = useColorScheme();
	const { setDomain } = useActiveDomainAction();
	const { t, i18n } = useTranslation();
	const isBurmese = i18n.language === 'my';
	return (
		<View>
			<View className="flex flex-row items-center mx-6 mt-4">
				<Pressable
					onPress={() => {
						setDomain('channel.org');
						navigation.navigate('Profile', {
							id: account.id,
						});
					}}
				>
					<Image className="w-[60] h-[60] rounded-full" uri={account.avatar} />
				</Pressable>

				<View className="flex flex-1 mx-3">
					<ThemeText className="font-NewsCycle_Bold" size="lg_18">
						{t('screen.search')}
					</ThemeText>
				</View>
				{/* SearchInput */}
			</View>
			<TextInput
				placeholder={t('search.search') + '...'}
				extraContainerStyle="h-11 w-100 mt-5 mb-2 mx-6"
				style={{
					...(isBurmese
						? Platform.select({
								android: { paddingVertical: 5 },
						  })
						: {}),
				}}
				startIcon={<SearchIcon />}
				onPress={e => {
					Keyboard.dismiss();
					e.preventDefault();
					navigation.navigate('SearchResults', {
						activeIndex: acitveIndex,
					});
				}}
			/>
			{/* {showUnderLine && <Underline className="mt-2" />} */}
		</View>
	);
};

export default SearchFeedHeader;
