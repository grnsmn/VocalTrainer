import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import BreathingSession from '../../components/Breath';
import { ScrollView } from '@gluestack-ui/themed';

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
				fontSize: 24,
				textAlign: 'center',
			},
		});
	}, []);

	return (
		<View style={styles.container}>
			<ScrollView flexGrow={1} h={'$full'}>
				<Text style={styles.Descript}>{esercizio?.descrizione}</Text>
				<BreathingSession
					pallini={esercizio?.lista_pallini}
					cicli={[esercizio?.cicli]}
				/>
				{/* <Button title='Next' onPress={navigation.navigate('Training', {esercizio: next.contenuto})}></Button> */}
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
		fontSize: 16,
		textAlign: 'center',
		color: 'red',
		fontWeight: 'bold',
	},
	Descript: {
		fontSize: 20,
		lineHeight: 30,
		textAlign: 'justify',
		fontStyle: 'bold',
		marginVertical: 16,
		paddingHorizontal: 16,
	},
});
export default TrainingScreen;
