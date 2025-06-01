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
				{/* <Text style={styles.Title}>{esercizio.titolo}</Text> */}
				<Text style={styles.Descript}>{esercizio?.descrizione}</Text>
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
	Title: {
		fontSize: 24,
		textAlign: 'center',
		color: 'red',
		fontWeight: 'bold',
	},
	Descript: {
		fontSize: 20,
		lineHeight: 27,
		textAlign: 'center',
		fontStyle: 'italic',
		marginVertical: 16,
		paddingHorizontal: 4,
	},
});
export default TrainingScreen;
