import {
	FeedDetail,
	FollowingAccounts,
	FollowerAccounts,
	Profile,
	SearchResults,
	HashTagDetail,
	SearchedAccountList,
	SuggestedPeopleList,
	NewsmastChannelTimeline,
	QuotedBy,
} from '@/screens';
import ProfileOther from '@/screens/ProfileOther/ProfileOther';
import { SearchStackParamList } from '@/types/navigation';
import ConversationsStack from './ConversationsStackNavigator';
import NewsmastCollections from '@/screens/NewsmastCollections/NewsmastCollections';
import NewsmastCollectionDetail from '@/screens/NewsmastCollectionDetail/NewsmastCollectionDetail';
import FavoritedBy from '@/screens/FavoritedBy/FavoritedBy';
import BoostedBy from '@/screens/BoostedBy/BoostedBy';
import NMChannelAllContributorList from '@/screens/NMChannelAllContributorList/NMChannelAllContributorList';
import NMChannelAllHashtagList from '@/screens/NMChannelAllHashtagList/NMChannelAllHashtagList';
import ArticleDetail from '@/screens/ArticleDetail/ArticleDetail';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator<SearchStackParamList>();

const SearchStack = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="SearchResults" component={SearchResults} />
			<Stack.Screen name="FeedDetail" component={FeedDetail} />
			<Stack.Screen name="Profile" component={Profile} />
			<Stack.Screen name="ProfileOther" component={ProfileOther} />
			<Stack.Screen name="FollowingAccounts" component={FollowingAccounts} />
			<Stack.Screen name="FollowerAccounts" component={FollowerAccounts} />
			<Stack.Screen name="Conversations" component={ConversationsStack} />
			<Stack.Screen name="HashTagDetail" component={HashTagDetail} />
			<Stack.Screen
				name="SearchedAccountList"
				component={SearchedAccountList}
			/>
			<Stack.Screen
				name="SuggestedPeopleList"
				component={SuggestedPeopleList}
			/>

			<Stack.Screen
				name="NewsmastChannelTimeline"
				component={NewsmastChannelTimeline}
			/>
			<Stack.Screen
				name="NewsmastCollections"
				component={NewsmastCollections}
			/>
			<Stack.Screen
				name="NewsmastCollectionDetail"
				component={NewsmastCollectionDetail}
			/>
			<Stack.Screen name="FavoritedBy" component={FavoritedBy} />
			<Stack.Screen name="BoostedBy" component={BoostedBy} />
			<Stack.Screen
				name="NMChannelAllContributorList"
				component={NMChannelAllContributorList}
			/>
			<Stack.Screen
				name="NMChannelAllHashtagList"
				component={NMChannelAllHashtagList}
			/>
			<Stack.Screen name="ArticleDetail" component={ArticleDetail} />
			<Stack.Screen name="QuotedBy" component={QuotedBy} />
		</Stack.Navigator>
	);
};

export default SearchStack;
