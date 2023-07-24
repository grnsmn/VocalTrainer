import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Text, FlatList } from 'react-native';
import { getStorage, ref, getDownloadURL, list } from 'firebase/storage';
import { Audio } from 'expo-av';

const storage = getStorage();

const storageRef = ref(storage, 'gs://vocaltrainer-bfc85.appspot.com');

const VocalizziScreen = ({ route, navigation }) => {
	const [sound, setSound] = useState('');
	const [soundChoose, setSoundChoose] = useState('');
	const [listVocalizzi, setListVocalizzi] = useState();

	useEffect(() => {
		const setAudio = async () => {
			const listStorage = await list(storageRef);

			setListVocalizzi(listStorage?.items);

			if (soundChoose !== '') {
				const soundRef = ref(
					storage,
					`gs://vocaltrainer-bfc85.appspot.com/${soundChoose}`,
				);
				const uri = await getDownloadURL(soundRef);
				console.log('Loading Sound');
				const { sound: soundFirebase } = await Audio.Sound.createAsync({
					uri,
				});
				setSound(soundFirebase);
			}
		};
		setAudio();
	}, [soundChoose]);

	useEffect(() => {
		const play = async () => {
			playSound();
		};
		play();
		return sound
			? () => {
					console.log('Unloading Sound');
					sound.unloadAsync();
			  }
			: undefined;
	}, [sound]);

	async function playSound() {
		if (sound) {
			const getSound = await sound?.getStatusAsync();
			if (!getSound.isPlaying) {
				console.log('Playing Sound');
				await sound.playAsync();
			} else {
				console.log('Pause Sound');
				await sound.stopAsync();
				setSoundChoose('');
				setSound('');
			}
		}
	}
	return (
		<View style={styles.container}>
			{listVocalizzi?.map((item, index) => {
				return (
					<View key={index} style={styles.playerButtons}>
						<Button
							width="auto"
							title={item?._location?.path}
							onPress={() =>
								setSoundChoose(item?._location?.path)
							}
							style={{ color: 'black' }}
						/>
					</View>
				);
			})}
			<Button title="Pausa esercizio in esecuzione" onPress={playSound} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'space-around',
	},
	playerButton: {
		paddingVertical: '10',
		backgroundColor: 'lightgreen',
	},
});

export default VocalizziScreen;
