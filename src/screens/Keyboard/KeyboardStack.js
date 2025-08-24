import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import KeyboardScreen from './KeyboardScreen';

const KeyboardStack = createNativeStackNavigator();

function KeyboardStackScreen() {
	return (
		<KeyboardStack.Navigator
			screenOptions={{
				headerShown: false,
			}}
		>
			<KeyboardStack.Screen
				name="Keyboard"
				component={KeyboardScreen}
				options={{
					tabBarStyle: { display: 'none' }, // Hide tab bar for keyboard screen
				}}
			/>
		</KeyboardStack.Navigator>
	);
}

export default KeyboardStackScreen;
