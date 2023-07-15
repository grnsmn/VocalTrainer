import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screen/HomeScreen';
import EserciziList from './src/Respirazione/Famiglia/EserciziList';
import FamiglieList from './src/Respirazione/FamiglieList';
import TrainingScreen from './src/screen/TrainingScreen';
//import VocalizziScreen from './src/screen/VocalizziScreen'
//import Metronome from './src/MetronomeHook'
import firebase from 'firebase/compat/app'
import * as Font from 'expo-font';
import {
  FIREBASE_CONFIG
} from '@env';
  
// Initialize Firebase
const firebaseConfig = FIREBASE_CONFIG;
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
} else {
  firebase.app() // if already initialized, use that one
}

const fetchFonts = () => {
	return Font.loadAsync({
		'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
	});
};

const Stack = createNativeStackNavigator();

export default function App() {
	useEffect(() => {
		fetchFonts();
	}, []);

	return (
		<NavigationContainer>
			<Stack.Navigator screenOptions={navScreensOptions}>
				<Stack.Screen
					name="Home"
					component={HomeScreen}
					options={{ title: 'Vocal Trainer' }}
				/>
				<Stack.Screen
					name="Lista Famiglie"
					component={FamiglieList}
					options={{ title: 'Famiglie' }}
				/>
				<Stack.Screen
					name="Lista esercizi"
					component={EserciziList}
					options={({ route }) => ({ title: route.params.name })}
				/>
				<Stack.Screen
					name="Training"
					component={TrainingScreen}
					options={({ route }) => ({ title: route.params.name })}
				/>
				{/* <Stack.Screen name='Vocalizzi' component={VocalizziScreen} /> */}
			</Stack.Navigator>
		</NavigationContainer>
	);
}

const navScreensOptions = {
	headerTitleAlign: 'center',
	headerStyle: {
		backgroundColor: '#1CC625',
	},
	headerTitleStyle: {
		fontWeight: 'bold',
		fontSize: 30,
		textAlign: 'center',
	},
};
