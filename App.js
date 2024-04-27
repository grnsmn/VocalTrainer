import { GluestackUIProvider, StatusBar } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from './src/screens/Home';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AudioLines } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<SafeAreaProvider>
				<GluestackUIProvider config={config}>
					<StatusBar />
					<Tab.Navigator
						screenOptions={({ route }) => ({
							tabBarIcon: ({ focused, color, size }) => {
								if (route.name === 'Vocalizzi') {
									return <AudioLines />;
								}
							},
							tabBarInactiveTintColor: 'gray',
							headerTitleAlign: 'center',
						})}
					>
						<Tab.Screen name="Vocalizzi" component={Home} />
						{/* <Tab.Screen name="Respirazione" component={Home} /> */}
					</Tab.Navigator>
				</GluestackUIProvider>
			</SafeAreaProvider>
		</NavigationContainer>
	);
}
