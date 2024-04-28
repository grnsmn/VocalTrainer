import { GluestackUIProvider, StatusBar } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { NavigationContainer } from '@react-navigation/native';
import { Vocalizations } from './src/screens/Vocalizations';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AudioLines } from 'lucide-react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VocalizationsList from './src/screens/Vocalizations/VocalizationsList';
import useFirebaseInit from './src/hooks/useFirebaseInit';

const Tab = createBottomTabNavigator();
const VocalizationsStack = createNativeStackNavigator();

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

export default function App() {
	useFirebaseInit();
	return (
		<NavigationContainer>
			<SafeAreaProvider>
				<GluestackUIProvider config={config}>
					<StatusBar />
					<Tab.Navigator
						screenOptions={({ route }) => ({
							tabBarIcon: ({ focused }) => {
								if (route.name === 'Vocalizzi') {
									return <AudioLines />;
								}
							},
							tabBarInactiveTintColor: 'gray',
							headerShown: false,
						})}
					>
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
