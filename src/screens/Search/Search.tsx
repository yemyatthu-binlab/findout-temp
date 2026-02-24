import { useCallback, useState } from 'react';
import { Tabs } from 'react-native-collapsible-tab-view';
import MaterialTabBarWrapper from '@/components/molecules/common/MaterialTabBarWrapper/MaterialTabBarWrapper';
import SearchFeedHeader from '@/components/molecules/search/SearchFeedHeader/SearchFeedHeader';
import SearchPeoplePosts from '@/components/organisms/search/SearchPeoplePosts/SearchPeoplePosts';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import { useAuthStore } from '@/store/auth/authStore';
import { SearchStackScreenProps } from '@/types/navigation';
import { useFocusEffect } from '@react-navigation/native';
import {
	useActiveDomainAction,
	useActiveDomainStore,
} from '@/store/feed/activeDomain';
import useDebounce from '@/hooks/custom/useDebounce';
import { useTranslation } from 'react-i18next';

const Search = ({ navigation }: SearchStackScreenProps<'SearchFeed'>) => {
	const { t } = useTranslation();
	const { userInfo, userOriginInstance } = useAuthStore();
	const [activeIndex, setActiveIndex] = useState(0);
	const { domain_name } = useActiveDomainStore();
	const { setDomain } = useActiveDomainAction();
	const startDebounce = useDebounce();

	useFocusEffect(
		useCallback(() => {
			if (userOriginInstance !== domain_name) {
				setDomain(userOriginInstance);
			}
		}, [domain_name]),
	);

	return (
		<SafeScreen>
			<SearchFeedHeader
				navigation={navigation}
				account={userInfo!}
				showUnderLine={true}
				acitveIndex={activeIndex}
			/>
			<Tabs.Container
				onIndexChange={index => {
					startDebounce(() => setActiveIndex(index), 500);
				}}
				renderTabBar={MaterialTabBarWrapper}
				tabBarHeight={300}
				containerStyle={{
					elevation: 0,
					shadowOpacity: 0,
					shadowColor: 'transparent',
				}}
				headerContainerStyle={{
					elevation: 0,
					shadowOpacity: 0,
					shadowColor: 'transparent',
				}}
				pagerProps={{
					style: {
						elevation: 0,
						shadowOpacity: 0,
						shadowColor: 'transparent',
					},
				}}
			>
				<Tabs.Tab
					label={t('search.people_and_posts')}
					name={'people_and_posts'}
				>
					<SearchPeoplePosts />
				</Tabs.Tab>
				<Tabs.Tab label={t('search.channels')} name="Channels">
					<></>
				</Tabs.Tab>
			</Tabs.Container>
		</SafeScreen>
	);
};

export default Search;
