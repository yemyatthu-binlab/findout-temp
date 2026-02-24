import StatusWrapper from '../../feed/StatusWrapper/StatusWrapper';
import { useTrendingHashTagsQueries } from '@/hooks/queries/hashtag.queries';
import { useGetTrendingStatuses } from '@/hooks/queries/feed.queries';
import { flattenPages } from '@/util/helper/timeline';
import { Tabs } from 'react-native-collapsible-tab-view';
import HashTagsBySearch from '@/components/molecules/search/HashTagsBySearch/HashTagsBySearch';
import SuggestedPeopleBySearch from '@/components/molecules/search/SuggestedPeopleBySearch/SuggestedPeopleBySearch';
import { useTranslation } from 'react-i18next';

const SearchPeoplePosts = () => {
	const { t } = useTranslation();
	const { data: trendingHashTags, isLoading: trendingHashTagsLoading } =
		useTrendingHashTagsQueries();

	const { data: trendingStatuses } = useGetTrendingStatuses({});

	return (
		<Tabs.Tab label={t('search.people_and_posts')} name="people_and_posts">
			<Tabs.FlashList
				data={flattenPages(trendingStatuses)}
				keyExtractor={item => item.id.toString()}
				renderItem={({ item }) => (
					<StatusWrapper
						status={item}
						currentPage="TrendingStatuses"
						statusType={item.reblog ? 'reblog' : 'normal'}
					/>
				)}
				ListHeaderComponent={() => (
					<>
						<HashTagsBySearch
							loading={trendingHashTagsLoading}
							trendingHashTags={trendingHashTags as Patchwork.HashtagDetail[]}
						/>
						<SuggestedPeopleBySearch />
					</>
				)}
				getItemType={item => {
					return item.id;
				}}
				showsVerticalScrollIndicator={false}
			/>
		</Tabs.Tab>
	);
};

export default SearchPeoplePosts;
