import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import BreathingSession from '../../components/Breath';
import { ScrollView } from '@gluestack-ui/themed';

const TrainingScreen = ({ route, navigation }) => {
	const { exercice } = route?.params;
	console.log('🚀 ~ exercice:', exercice);

	useEffect(() => {
		navigation.setOptions({
			title: exercice?.name,
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
				{/* <Text style={styles.Descript}>{exercice?.description}</Text> */}
				<BreathingSession exercise={exercice} />
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
