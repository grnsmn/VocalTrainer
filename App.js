import {
	GluestackUIProvider,
	SafeAreaView,
	Text,
	Box,
	StatusBar,
} from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from './src/screens/Home';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<SafeAreaProvider>
				<GluestackUIProvider config={config}>
					<StatusBar />
					<Tab.Navigator
						screenOptions={{ headerTitleAlign: 'center' }}
					>
						<Tab.Screen
							name="Vocalizzi"
							component={Home}
							screenOptions={{ headerShown: false }}
						/>
					</Tab.Navigator>
				</GluestackUIProvider>
			</SafeAreaProvider>
		</NavigationContainer>
	);
}
