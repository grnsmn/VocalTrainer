import { StatusBar } from '@/components/ui/status-bar';
import { Icon } from '@/components/ui/icon';
// App.js
import React, { useEffect, useState } from 'react';
import '@/global.css';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { NavigationContainer } from '@react-navigation/native';
import { Vocalizations } from './src/screens/Vocalizations';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
	AudioLines,
	Wind,
	KeyRoundIcon,
	KeyboardMusicIcon,
} from 'lucide-react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useFirebaseInit from './src/hooks/useFirebaseInit';
import VocalizationsList from './src/screens/Vocalizations/VocalizationsList';
import CategoriesBreath from './src/screens/Breathing/CategoriesBreath';
import BreathingList from './src/screens/Breathing/BreathingList';
import TrainingScreen from './src/screens/Breathing/TrainingScreen';
import AuthScreen from './src/screens/Auth';
import KeyboardStackScreen from './src/screens/Keyboard/KeyboardStack';

import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import HeaderRight from './src/components/HeaderRight';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Platform } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import useAuthSync from './src/hooks/useAuthSync';
import { useAuthStore } from './src/store/auth';

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();
const VocalizationsStack = createNativeStackNavigator();
const BreathingStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
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

function getActiveTabName(state) {
	if (!state) return null;
	const route = state.routes[state.index];
	return route.name;
}

export default function App() {
	useFirebaseInit();
	useAuthSync();
	const auth = useAuthStore(state => state.auth);

	const [fontsLoaded] = useFonts({
		Roboto: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
	});

	useEffect(() => {
		async function prepare() {
			try {
				if (fontsLoaded) {
					await SplashScreen.hideAsync();
				}
			} catch (e) {
				console.warn('Errore durante il caricamento del font:', e);
			}
		}

		prepare();
	}, [fontsLoaded]);

	if (!fontsLoaded || auth === undefined) {
		return null;
	}

	return (
		<NavigationContainer>
			<SafeAreaProvider>
				<GluestackUIProvider mode="light">
					<StatusBar />
					<Tab.Navigator
						screenOptions={({ route }) => ({
							tabBarActiveBackgroundColor: '#c6e9ff',
							tabBarIcon: ({ focused }) => {
								if (route.name === 'Vocalizzi') {
									return (
										<Icon
											as={AudioLines}
											className="text-primary-500"
										/>
									);
								}
								if (route.name === 'Respirazione') {
									return (
										<Icon
											as={Wind}
											className="text-primary-500"
										/>
									);
								}
								if (route.name === 'Auth') {
									return (
										<Icon
											as={KeyRoundIcon}
											className="text-primary-500"
										/>
									);
								}
								if (route.name === 'Piano') {
									return (
										<Icon
											as={KeyboardMusicIcon}
											className="text-primary-500"
										/>
									);
								}
							},
							headerShown: false,
							tabBarLabelStyle: {
								fontSize: 14,
								fontWeight: 'bold',
								fontFamily: 'Roboto',
							},
							tabBarItemStyle: {
								borderColor: '#CCE9FF',
								padding: 10,
							},
							tabBarIconStyle: {
								paddingBottom: 6,
							},
						})}
					>
						{auth === null ? (
							<Tab.Screen
								name="Auth"
								component={AuthStackScreen}
								options={{
									tabBarStyle: { display: 'none' },
								}}
							/>
						) : (
							<>
								<Tab.Screen
									name="Respirazione"
									component={BreathingStackScreen}
								/>
								<Tab.Screen
									name="Vocalizzi"
									component={VocalizationsStackScreen}
								/>
								<Tab.Screen
									name="Piano"
									component={KeyboardStackScreen}
								/>
							</>
						)}
					</Tab.Navigator>
				</GluestackUIProvider>
			</SafeAreaProvider>
		</NavigationContainer>
	);
}
