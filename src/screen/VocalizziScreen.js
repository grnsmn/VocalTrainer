import React from 'react';
import { StyleSheet, View, Button } from 'react-native';

const VocalizziScreen = ({ route, navigation }) => {
	const { vocals } = route.params;
	
	return (
		<View style={styles.container}>
			<Button
				title="Trillo"
				onPress={() => navigation.navigate('VocalizziList',{vocals, name: 'Trillo'})}
			/>
			<Button
				title="Humming"
				onPress={() => navigation.navigate('VocalizziList',{vocals, name: 'Humming'})}
			/>
			<Button
				title="Gne"
				onPress={() => navigation.navigate('VocalizziList',{vocals, name: 'Gne'})}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'space-around',
		height: '100%',
	},
	playerButton: {
		flex: 1,
		paddingVertical: '10',
		backgroundColor: 'lightgreen',
	},
});

export default VocalizziScreen;
