// App.js
import React, { useEffect } from 'react';
import { GluestackUIProvider, Icon, StatusBar } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { NavigationContainer } from '@react-navigation/native';
import { Vocalizations } from './src/screens/Vocalizations';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AudioLines, Wind, KeyRoundIcon, LogOut } from 'lucide-react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useFirebaseInit from './src/hooks/useFirebaseInit';
import VocalizationsList from './src/screens/Vocalizations/VocalizationsList';
import CategoriesBreath from './src/screens/Breathing/CategoriesBreath';
import BreathingList from './src/screens/Breathing/BreathingList';
import TrainingScreen from './src/screens/Breathing/TrainingScreen';
import AuthScreen from './src/screens/Auth';
import useStore from './src/store';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import HeaderRight from './src/components/HeaderRight';
const Tab = createBottomTabNavigator();
const VocalizationsStack = createNativeStackNavigator();
const BreathingStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator(); // Create a stack for authentication
const screenOptions = {
	headerTitleAlign: 'center',
	headerStyle: { backgroundColor: '#c6e9ff' },
	title: 'Vocal Trainer',
};

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
				...screenOptions,
				headerRight: () => <HeaderRight />,
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
	return (
		<BreathingStack.Navigator
			screenOptions={{
				...screenOptions,
				headerRight: () => <HeaderRight />,
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
		<AuthStack.Navigator screenOptions={screenOptions}>
			<AuthStack.Screen name="Main" component={AuthScreen} />
		</AuthStack.Navigator>
	);
}

export default function App() {
	useFirebaseInit();
	const { auth, setAuth } = useStore();
	const { getItem } = useAsyncStorage('authData');

	useEffect(() => {
		const restoreCacheAuthData = async () => {
			try {
				const data = await getItem();
				if (data) {
					setAuth(JSON.parse(data));
				}
			} catch (e) {
				console.error('Failed to fetch data from storage', e);
			}
		};

		restoreCacheAuthData();
	}, []);

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
						initialRouteName={!auth ? 'Auth' : 'Respirazione'}
					>
						{!auth && (
							<Tab.Screen
								name="Auth"
								component={AuthStackScreen}
							/>
						)}
						{!!auth && (
							<>
								<Tab.Screen
									name="Respirazione"
									component={BreathingStackScreen}
								/>
								<Tab.Screen
									name="Vocalizzi"
									component={VocalizationsStackScreen}
								/>
							</>
						)}
					</Tab.Navigator>
				</GluestackUIProvider>
			</SafeAreaProvider>
		</NavigationContainer>
	);
}
