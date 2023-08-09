import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { getStorage, ref } from 'firebase/storage';
import { STORAGE_PATH } from '@env';

const storage = getStorage();

const storageRef = ref(storage, STORAGE_PATH);

const VocalizziScreen = ({ navigation }) => {
	return (
		<View style={styles.container}>
			<Button
				title="Uomo"
				onPress={() => navigation.navigate('Vocalizzi', {vocals: 'Uomo'})}
			/>
			<Button title="Donna" onPress={() => navigation.navigate('')} />
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
