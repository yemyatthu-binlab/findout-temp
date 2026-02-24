import React, { PropsWithChildren } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import { StyleProp, View, ViewStyle } from 'react-native';

export type RootStackParamList = {
	MockScreen: undefined;
};

type Prop = {
	additionalStyle?: StyleProp<ViewStyle>;
};
const Stack = createStackNavigator<RootStackParamList>();

function StroyNavigator({
	children,
	additionalStyle,
}: PropsWithChildren & Prop) {
	return (
		<SafeAreaProvider>
			<NavigationContainer>
				<Stack.Navigator screenOptions={{ headerShown: false }}>
					<Stack.Screen name="MockScreen">
						{() => (
							<SafeScreen>
								<View
									style={[
										{ marginHorizontal: 25, marginVertical: 5 },
										additionalStyle,
									]}
								>
									{children}
								</View>
							</SafeScreen>
						)}
					</Stack.Screen>
				</Stack.Navigator>
			</NavigationContainer>
		</SafeAreaProvider>
	);
}

export default StroyNavigator;
