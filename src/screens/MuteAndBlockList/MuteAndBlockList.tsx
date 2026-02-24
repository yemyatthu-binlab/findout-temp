import React, { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { TabView } from 'react-native-tab-view';
import BackButton from '@/components/atoms/common/BackButton/BackButton';
import Header from '@/components/atoms/common/Header/Header';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import { useColorScheme } from 'nativewind';
import NotiTabBarItemLabel from '@/components/atoms/notifications/NotiTabBarItemLabel/NotiTabBarItemLabel';
import TabBar from '@/components/molecules/common/TabBar/TabBar';
import NotiAll from '@/components/organisms/notifications/NotiAll/NotiAll';
import NotiMentions from '@/components/organisms/notifications/NotiMentions/NotiMentions';
import NotiFollowRequest from '@/components/organisms/notifications/NotiFollowRequest/NotiFollowRequest';
import { SettingStackScreenProps } from '@/types/navigation';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { cn } from '@/util/helper/twutil';
import MutedUserList from '@/components/organisms/muteblock/MutedUserList/MutedUserList';
import BlockedUserList from '@/components/organisms/muteblock/BLockedUserList/BlockedUserList';
import MuteBlockTabBarLabel from '@/components/atoms/muteblock/MuteBlockTabBarLabel/MuteBlockTabBarLabel';
import { useTranslation } from 'react-i18next';

export type TabViewRoute = {
	key: string;
	title: string;
};

const MuteAndBlockList: React.FC<
	SettingStackScreenProps<'MuteAndBlockList'>
> = ({ route }) => {
	const { t } = useTranslation();
	const { colorScheme } = useColorScheme();

	const layout = useWindowDimensions();
	const [index, setIndex] = useState(0);

	const [routes] = useState<TabViewRoute[]>([
		{ key: 'mute', title: t('timeline.mute') },
		{ key: 'block', title: t('timeline.block') },
	]);

	const renderScene = ({ route }: { route: TabViewRoute }) => {
		switch (route.key) {
			case 'mute':
				return <MutedUserList />;
			case 'block':
				return <BlockedUserList />;
			default:
				return <></>;
		}
	};

	return (
		<SafeScreen>
			<Header
				title={t('screen.mute_and_block')}
				leftCustomComponent={<BackButton />}
			/>
			<TabView
				navigationState={{ index, routes }}
				renderScene={renderScene}
				onIndexChange={setIndex}
				initialLayout={{ width: layout.width }}
				renderTabBar={props => (
					<TabBar
						{...props}
						renderLabel={({ route, focused }) => (
							<MuteBlockTabBarLabel focused={focused} title={route.title} />
						)}
					/>
				)}
			/>
		</SafeScreen>
	);
};

export default MuteAndBlockList;
