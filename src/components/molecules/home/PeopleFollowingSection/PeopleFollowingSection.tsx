import { Pressable, View } from 'react-native';
import AccountAvatar from '@/components/molecules/feed/AccountAvatar/AccountAvatar';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { AccountListIcon } from '@/util/svg/icon.common';
import customColor from '@/util/constant/color';
import { useAuthStore } from '@/store/auth/authStore';
import { useTranslation } from 'react-i18next';

type Props = {
	data: Patchwork.Account[];
	onPressItem: (item: Patchwork.Account) => void;
	onPressViewAll: () => void;
	onPressFollowing?: () => void;
};

export const PeopleFollowingSection = ({
	data,
	onPressItem,
	onPressViewAll,
	onPressFollowing,
}: Props) => {
	const { t } = useTranslation();
	const { userOriginInstance } = useAuthStore();

	const modifiedData =
		userOriginInstance !== process.env.API_URL && onPressFollowing
			? [{ id: 'icon' } as Patchwork.Account, ...data]
			: data;

	return (
		<View className="pb-4">
			<View className="flex-row items-center px-4">
				<ThemeText className="font-NewsCycle_Bold my-2 flex-1" size="lg_18">
					{t('timeline.following')}
				</ThemeText>
				<Pressable onPress={onPressViewAll} className="active:opacity-80">
					<ThemeText variant="textGrey">{t('common.view_all')}</ThemeText>
				</Pressable>
			</View>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ paddingLeft: 16 }}
			>
				{modifiedData.slice(0, 10).map(item =>
					item.id === 'icon' ? (
						<Pressable
							key="following-icon"
							onPress={onPressFollowing}
							className="mr-4 items-center"
						>
							<View className="items-center justify-center w-[100] h-[100] rounded-full bg-patchwork-light-100">
								<AccountListIcon stroke={customColor['patchwork-dark-100']} />
							</View>
							<ThemeText variant={'textGrey'} className="mt-2.5">
								{t('timeline.following')}
							</ThemeText>
						</Pressable>
					) : (
						<AccountAvatar
							key={item.id.toString()}
							account={item}
							size={'md'}
							className="mr-4 w-[110]"
							onPress={() => onPressItem(item)}
						/>
					),
				)}
			</ScrollView>
		</View>
	);
};
