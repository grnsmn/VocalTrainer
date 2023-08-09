import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, FlatList } from 'react-native';
import { getStorage, ref, getDownloadURL, list } from 'firebase/storage';
import { Audio } from 'expo-av';
import { STORAGE_PATH } from '@env';
console.log('🚀 ~ STORAGE_PATH:', STORAGE_PATH);

const storage = getStorage();


const Gne = ({ route }) => {
    const { vocals } = route.params;
	const [sound, setSound] = useState('');
	const [soundChoose, setSoundChoose] = useState('');
	const [listVocalizzi, setListVocalizzi] = useState();
    const endpoint = `${STORAGE_PATH}/${vocals}/Gne`
    const storageRef = ref(storage, endpoint);
    
	useEffect(() => {
		const setAudio = async () => {
			const listStorage = await list(storageRef);

			setListVocalizzi(listStorage?.items);

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
		return (
			<View style={styles.playerButtons}>
				<Button
					title={item?._location?.path}
					onPress={() => setSoundChoose(item?._location?.path)}
					style={{ color: 'black' }}
				/>
			</View>
		);
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

export default Gne;
