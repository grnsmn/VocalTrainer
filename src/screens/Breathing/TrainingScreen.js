import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import Esercizio from '../../components/Esercizio';
// import Metronome from '../components/MetronomeHook'

const TrainingScreen = ({ route, navigation }) => {
	const { esercizio } = route?.params;
	console.log('🚀 ~ esercizio:', esercizio);

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
			<View style={styles.Esercizio}>
				{/* <Text style={styles.Title}>{esercizio.titolo}</Text> */}
				<Text style={styles.Descript}>{esercizio?.descrizione}</Text>
				<Esercizio
					pallini={esercizio?.lista_pallini}
					cicli={[esercizio?.cicli]}
				/>
				{/* <Metronome pallini={esercizio.lista_pallini}  cicli= {[esercizio.cicli]}/> */}

				{/* <Button title='Next' onPress={navigation.navigate('Training', {esercizio: next.contenuto})}></Button> */}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		// alignItems: 'center'
	},
	Esercizio: {
		flex: 1,
	},
	Title: {
		fontSize: 25,
		textAlign: 'center',
		color: 'red',
		fontWeight: 'bold',
	},
	Descript: {
		fontSize: 25,
		lineHeight: 27,
		textAlign: 'center',
		fontStyle: 'italic',
		marginVertical: 16,
		paddingHorizontal: 4,
	},
});
export default TrainingScreen;
