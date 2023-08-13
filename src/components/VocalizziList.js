import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, FlatList } from 'react-native';
import { getStorage, ref, getDownloadURL, list } from 'firebase/storage';
import { Audio } from 'expo-av';
import { STORAGE_PATH } from '@env';

const storage = getStorage();

const VocalizziList = ({ route }) => {
	const { vocals, name } = route.params;

	const [sound, setSound] = useState('');
	const [soundChoose, setSoundChoose] = useState('');
	const [listVocalizzi, setListVocalizzi] = useState();
	const endpoint = `${STORAGE_PATH}/${vocals}/${name}`;
	const storageRef = ref(storage, endpoint);

	useEffect(() => {
		const setList = async () => {
			const listStorage = await list(storageRef);

			setListVocalizzi(listStorage?.items);
		};
		setList();
	}, []);

	useEffect(() => {
		const setAudio = async () => {
			if (soundChoose !== '') {
				const soundRef = ref(storage, `${STORAGE_PATH}/${soundChoose}`);
				if (soundRef) {
					const uri = await getDownloadURL(soundRef);
					console.log('Loading Sound');
					const { sound: soundFirebase } =
						await Audio.Sound.createAsync({
							uri,
						});
					setSound(soundFirebase);
				}
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

	const renderItem = ({ item }) => {
		const regex = /\btraccia\s(?:[1-9]|[1-9][0-9]|100)\b/;
		const match = item?._location?.path.match(regex);

		if (match) {
			const title = match[0]; // Estrae la sottostringa corrispondente al pattern
			return (
				<View style={styles.playerButtons}>
					<Button
						title={title}
						onPress={() => setSoundChoose(item?._location?.path)}
						style={{ color: 'black' }}
					/>
				</View>
			);
		} else {
			// Ritorna qualcosa in caso la regex non corrisponda
			return null;
		}
	};

	return (
		<FlatList
			data={listVocalizzi}
			renderItem={renderItem}
			contentContainerStyle={styles.container}
			ListFooterComponent={
				<Button
					title="Pausa esercizio in esecuzione"
					onPress={playSound}
					color={'red'}
				/>
			}
		/>
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

export default VocalizziList;
