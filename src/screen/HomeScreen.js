import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, RefreshControl, Button } from 'react-native';
import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import useFirebaseInit from '../services/initFirebase';

useFirebaseInit()

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
			<View style={styles.container}>
				<StatusBar style="auto" />
				<Button
					style={styles.button}
					title={'Respirazione'}
					onPress={() =>
						navigation.navigate('Lista Famiglie', {
							lista: famiglieRespirazione,
						})
					}
				></Button>
				<Button style={styles.button} title={'Ritmico'}></Button>
				<Button
					style={styles.button}
					title={'Vocalizzi'}
					onPress={() => navigation.navigate('Vocalizzi')}
				></Button>
			</View>
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
