import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screen/HomeScreen';
import EserciziList from './src/Respirazione/Famiglia/EserciziList';
import FamiglieList from './src/Respirazione/FamiglieList';
import TrainingScreen from './src/screen/TrainingScreen';
import VocalizziCategoryList from './src/screen/VocalizziCategoryList';
import VocalsChoose from './src/screen/VocalsChoose';
//import Metronome from './src/MetronomeHook'
import * as Font from 'expo-font';
import VocalizziList from './src/components/VocalizziList';
import { GluestackUIProvider, Text, Box } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';

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
		<GluestackUIProvider config={config}>
			<NavigationContainer>
				<Stack.Navigator
					initialRouteName="Home"
					screenOptions={navScreensOptions}
				>
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
					<Stack.Screen
						name="VocalsChoose"
						component={VocalsChoose}
					/>
					<Stack.Screen
						name="Vocalizzi"
						component={VocalizziCategoryList}
					/>
					<Stack.Screen
						name="VocalizziList"
						component={VocalizziList}
						options={({ route }) => ({ title: route.params.name })}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</GluestackUIProvider>
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
