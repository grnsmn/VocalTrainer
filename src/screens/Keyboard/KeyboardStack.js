import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import KeyboardScreen from './KeyboardScreen';
import HeaderRight from '../../components/HeaderRight';

const KeyboardStack = createNativeStackNavigator();

const screenOptions = {
	headerTitleAlign: 'center',
	headerStyle: { backgroundColor: '#c6e9ff' },
	title: 'Vocal Trainer',
};

function KeyboardStackScreen() {
	return (
		<KeyboardStack.Navigator
			screenOptions={{
				...screenOptions,
				headerRight: () => <HeaderRight />,
			}}
		>
			<KeyboardStack.Screen name="Keyboard" component={KeyboardScreen} />
		</KeyboardStack.Navigator>
	);
}

export default KeyboardStackScreen;
