import {
	GluestackUIProvider,
	SafeAreaView,
	Text,
	Box,
	StatusBar,
} from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
	return (
		<NavigationContainer>
			<GluestackUIProvider config={config}>
				<SafeAreaView flex={1}>
					<StatusBar />
					<Box flex={1} justifyContent="center" alignItems="center">
						<Text textAlign="center">
							Open up App.js to start working on your app!
						</Text>
					</Box>
				</SafeAreaView>
			</GluestackUIProvider>
		</NavigationContainer>
	);
}
