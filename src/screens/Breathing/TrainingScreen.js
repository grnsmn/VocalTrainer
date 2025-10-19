import { ScrollView } from '@/components/ui/scroll-view';
import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import Esercizio from '../../components/Esercizio';
// import Metronome from '../components/MetronomeHook'

const TrainingScreen = ({ route, navigation }) => {
	const { esercizio } = route?.params;

	useEffect(() => {
		navigation.setOptions({
			title: esercizio?.titolo,
			headerTitleAlign: 'center',
			headerStyle: {
				backgroundColor: '#c6e9ff',
			},
			headerTitleStyle: {
				fontWeight: 'bold',
				fontSize: 28,
				textAlign: 'center',
			},
		});
	}, []);
	return (
		<View style={styles.container}>
			<ScrollView className="grow-[1px] h-full">
				<Text className="text-xl leading-[24px] text-center italic my-4 px-1 ">
					{esercizio?.descrizione}
				</Text>
				<Esercizio
					pallini={esercizio?.lista_pallini}
					cicli={[esercizio?.cicli]}
				/>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: '100%',
	},
});
export default TrainingScreen;
