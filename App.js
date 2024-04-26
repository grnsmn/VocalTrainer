import { StatusBar } from 'expo-status-bar';
import {
	GluestackUIProvider,
	SafeAreaView,
	Text,
	Box,
} from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';

export default function App() {
	return (
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
	);
}
