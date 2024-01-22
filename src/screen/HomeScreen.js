import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import useFirebaseInit from '../services/initFirebase';
import { Box, Button, ButtonText } from '@gluestack-ui/themed';

useFirebaseInit();

const db = getDatabase();
const refRespirazione = ref(db, '/Respirazione/');

export default function HomeScreen({ navigation }) {
	const [famiglieRespirazione, setFamiglieRespirazione] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let tmp = [];
		let famiglia = {};
		setFamiglieRespirazione([]);
		onValue(refRespirazione, snapshot => {
			setLoading(!loading);
			snapshot.forEach(childSnap => {
				famiglia = { id: childSnap.key, contenuto: childSnap.val() };
				tmp.push(famiglia);
			});
			setFamiglieRespirazione(tmp);
		});
	}, []);

	useEffect(() => {
		setLoading(!loading);
	}, [famiglieRespirazione]);

	if (loading === true) {
		return (
			<RefreshControl
				refreshing={loading}
				onRefresh={() => console.log('refres')}
			></RefreshControl>
		);
	} else
		return (
			<Box style={styles.container}>
				<StatusBar style="light" />
				<Button
					onPress={() =>
						navigation.navigate('Lista Famiglie', {
							lista: famiglieRespirazione,
						})
					}
				>
					<ButtonText>Respirazione</ButtonText>
				</Button>
				<Button onPress={() => navigation.navigate('VocalsChoose')}>
					<ButtonText>Ritmico</ButtonText>
				</Button>
				<Button onPress={() => navigation.navigate('VocalsChoose')}>
					<ButtonText>Vocalizzi</ButtonText>
				</Button>
			</Box>
		);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'space-around',
	},
	button: {
		fontSize: 90,
		height: 100,
		marginBottom: 20,
	},
});
