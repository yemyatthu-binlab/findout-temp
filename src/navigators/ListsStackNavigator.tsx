import { Lists, ListTimelines, ManageListMembers, UpsertList } from '@/screens';
import { ListsStackParamList } from '@/types/navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createNativeStackNavigator<ListsStackParamList>();

const ListsStack = () => {
	return (
		<Stack.Navigator
			initialRouteName="Lists"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen name="Lists" component={Lists} />
			<Stack.Screen name="ListTimelines" component={ListTimelines} />
			<Stack.Screen name="UpsertList" component={UpsertList} />
			<Stack.Screen name="ManageListMembers" component={ManageListMembers} />
		</Stack.Navigator>
	);
};

export default ListsStack;
