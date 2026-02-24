import { ConversationsStackParamList } from '@/types/navigation';
import {
	NewMessage,
	ConversationDetail,
	ConversationList,
	NotificationRequests,
	Profile,
	FollowingAccounts,
	FollowerAccounts,
	FeedDetail,
	QuotedBy,
} from '@/screens';
import InitiateNewConversation from '@/screens/InitiateNewConversation/InitiateNewConversation';
import ProfileOther from '@/screens/ProfileOther/ProfileOther';
import FavoritedBy from '@/screens/FavoritedBy/FavoritedBy';
import BoostedBy from '@/screens/BoostedBy/BoostedBy';
import ArticleDetail from '@/screens/ArticleDetail/ArticleDetail';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator<ConversationsStackParamList>();

const ConversationsStack = () => {
	return (
		<Stack.Navigator
			initialRouteName="ConversationList"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen name="ConversationList" component={ConversationList} />
			<Stack.Screen name="NewMessage" component={NewMessage} />
			<Stack.Screen name="ConversationDetail" component={ConversationDetail} />
			<Stack.Screen
				name="InitiateNewConversation"
				component={InitiateNewConversation}
			/>
			<Stack.Screen
				name="NotificationRequests"
				component={NotificationRequests}
			/>
			<Stack.Screen name="Profile" component={Profile} />
			<Stack.Screen name="ProfileOther" component={ProfileOther} />
			<Stack.Screen name="FollowingAccounts" component={FollowingAccounts} />
			<Stack.Screen name="FollowerAccounts" component={FollowerAccounts} />
			<Stack.Screen name="FeedDetail" component={FeedDetail} />
			<Stack.Screen name="FavoritedBy" component={FavoritedBy} />
			<Stack.Screen name="BoostedBy" component={BoostedBy} />
			<Stack.Screen name="ArticleDetail" component={ArticleDetail} />
			<Stack.Screen name="QuotedBy" component={QuotedBy} />
		</Stack.Navigator>
	);
};

export default ConversationsStack;
