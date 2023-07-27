import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screen/HomeScreen';
import EserciziList from './src/Respirazione/Famiglia/EserciziList';
import FamiglieList from './src/Respirazione/FamiglieList';
import TrainingScreen from './src/screen/TrainingScreen';
// import VocalizziScreen from './src/screen/VocalizziScreen'
//import Metronome from './src/MetronomeHook'
import * as Font from 'expo-font';
import firebase from 'firebase/compat/app';
import {
	API_KEY,
	AUTH_DOMAIN,
	DATABASE_URL,
	PROJECT_ID,
	STORAGE_BUCKET,
	MESSAGING_SENDER_ID,
	APP_ID,
	MEASUREMENT_ID,
} from '@env';
console.log('🚀 ~ PROJECT_ID:', PROJECT_ID);

// // Get a reference to the storage service, which is used to create references in your storage bucket
// // Initialize Firebase
// const firebaseConfig = {
// 	apiKey: API_KEY,
// 	authDomain: AUTH_DOMAIN,
// 	databaseURL:DATABASE_URL,
// 	projectId: PROJECT_ID,
// 	storageBucket: STORAGE_BUCKET,
// 	messagingSenderId: MESSAGING_SENDER_ID,
// 	appId: APP_ID,
// 	measurementId: MEASUREMENT_ID,
// };

// if (!firebase.apps.length) {
// 	firebase.initializeApp(firebaseConfig);
// } else {
// 	firebase.app(); // if already initialized, use that one
// }

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
			<Stack.Navigator initialRouteName='Home' screenOptions={navScreensOptions}>
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
