// App.js
import React from 'react';
import { GluestackUIProvider, Icon, StatusBar } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { NavigationContainer } from '@react-navigation/native';
import { Vocalizations } from './src/screens/Vocalizations';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AudioLines, Wind, KeyRoundIcon } from 'lucide-react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useFirebaseInit from './src/hooks/useFirebaseInit';
import VocalizationsList from './src/screens/Vocalizations/VocalizationsList';
import CategoriesBreath from './src/screens/Breathing/CategoriesBreath';
import BreathingList from './src/screens/Breathing/BreathingList';
import TrainingScreen from './src/screens/Breathing/TrainingScreen';
import AuthScreen from './src/screens/Auth';

const Tab = createBottomTabNavigator();
const VocalizationsStack = createNativeStackNavigator();
const BreathingStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator(); // Create a stack for authentication

function VocalizationsStackScreen() {
	const getDynamicHeader = ({ route }) => {
		//Replace usato per il caso di route name lunghi passati in
		//camel case che vengono divisi con spazio per una migliore leggibilità nell'header della UI
		const dynamicHeaderPart = route.params?.selectedListName
			.replace(/([A-Z])/g, ' $1')
			.trim();

		return {
			title: `Esercizi ${dynamicHeaderPart}` || 'Lista Esercizi',
		};
	};

	return (
		<VocalizationsStack.Navigator
			screenOptions={{
				headerTitleAlign: 'center',
				headerStyle: { backgroundColor: '#c6e9ff' },
				title: 'Vocal Trainer',
			}}
		>
			<VocalizationsStack.Screen name="Home" component={Vocalizations} />
			<VocalizationsStack.Screen
				name="Lista"
				component={VocalizationsList}
				options={getDynamicHeader}
			/>
		</VocalizationsStack.Navigator>
	);
}

function BreathingStackScreen() {
	const getDynamicHeader = ({ route }) => {
		//Replace usato per il caso di route name lunghi passati in
		//camel case che vengono divisi con spazio per una migliore leggibilità nell'header della UI
		const dynamicHeaderPart = route.params?.selectedListName
			.replace(/([A-Z])/g, ' $1')
			.trim();

		return {
			title: `Esercizi ${dynamicHeaderPart}` || 'Lista Esercizi',
		};
	};

	return (
		<BreathingStack.Navigator
			screenOptions={{
				headerTitleAlign: 'center',
				headerStyle: { backgroundColor: '#c6e9ff' },
				title: 'Vocal Trainer',
			}}
		>
			<BreathingStack.Screen
				name="BreathingFamilies"
				component={CategoriesBreath}
			/>
			<BreathingStack.Screen
				name="BreathingList"
				component={BreathingList}
			/>
			<BreathingStack.Screen name="Training" component={TrainingScreen} />
		</BreathingStack.Navigator>
	);
}

function AuthStackScreen() {
	return (
		<AuthStack.Navigator
			screenOptions={{
				headerTitleAlign: 'center',
				headerStyle: { backgroundColor: '#c6e9ff' },
				title: 'Authentication',
				headerShown: false
			}}
		>
			<AuthStack.Screen name="Auth" component={AuthScreen} />
		</AuthStack.Navigator>
	);
}

export default function App() {
	useFirebaseInit();
	return (
		<NavigationContainer>
			<SafeAreaProvider>
				<GluestackUIProvider config={config}>
					<StatusBar />
					<Tab.Navigator
						screenOptions={({ route }) => ({
							tabBarActiveBackgroundColor: '#c6e9ff',
							tabBarIcon: ({ focused }) => {
								if (route.name === 'Vocalizzi') {
									return (
										<Icon
											as={AudioLines}
											color={'$primary500'}
										/>
									);
								}
								if (route.name === 'Respirazione') {
									return (
										<Icon as={Wind} color={'$primary500'} />
									);
								}
								if (route.name === 'Auth') {
									return (
										<Icon
											as={KeyRoundIcon}
											color={'$primary500'}
										/>
									);
								}
							},
							headerShown: false,
							tabBarLabelStyle: {
								fontSize: 14,
								fontWeight: 'bold',
							},
							tabBarItemStyle: {
								borderColor: '#CCE9FF',
								padding: 10,
							},
							tabBarIconStyle: {
								paddingBottom: 6, // Aumenta il valore negativo per più spazio
							},
						})}
						initialRouteName="Auth"
					>
						<Tab.Screen name="Auth" component={AuthStackScreen} />
						<Tab.Screen
							name="Respirazione"
							component={BreathingStackScreen}
						/>
						<Tab.Screen
							name="Vocalizzi"
							component={VocalizationsStackScreen}
						/>
					</Tab.Navigator>
				</GluestackUIProvider>
			</SafeAreaProvider>
		</NavigationContainer>
	);
}
