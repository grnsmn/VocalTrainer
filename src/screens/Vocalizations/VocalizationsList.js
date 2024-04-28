import React, { useEffect, useState } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { STORAGE_PATH } from '@env';
import useVocalizationsList from '../../hooks/useVocalizationsList';
import useStorage from '../../hooks/useStorage';
import CardPlay from '../../components/CardPlay';
import { Audio } from 'expo-av';
import {
	Center,
	FlatList,
	Icon,
	Spinner,
	Text,
	VStack,
} from '@gluestack-ui/themed';
import { CirclePlay, Pause } from 'lucide-react-native';

const VocalizationsList = ({ route }) => {
	const { typeVocal, selectedListName } = route.params;
	const { storage, storageRef } = useStorage({
		customPath: `${typeVocal}/${selectedListName}`,
	});
	const { data, loading } = useVocalizationsList({
		storageRef,
	});
	//TODO: pulire le logiche nella richiesta e uso della traccia
	const [sound, setSound] = useState('');
	const [soundChoose, setSoundChoose] = useState('');

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
				// console.log('Playing Sound');
				await sound.playAsync();
			} else {
				// console.log('Pause Sound');
				await sound.stopAsync();
				setSoundChoose('');
				setSound('');
			}
		}
	}

	const renderItem = ({ item }) => {
		const regex = /\btraccia\s(?:[1-9]|[1-9]\d|100)\b/i;
		const match = item?._location?.path.match(regex);

		if (match) {
			const title = match[0]; // Estrae la sottostringa corrispondente al pattern
			return (
				<CardPlay
					title={title}
					onPress={() => setSoundChoose(item?._location?.path)}
					RightIcon={CirclePlay}
				/>
			);
		} else {
			return null;
		}
	};

	if (loading) {
		return (
			<VStack
				flex={1}
				space="sm"
				justifyContent="center"
				alignItems="center"
			>
				<Spinner size="small" />
				<Text size="md">Please Wait</Text>
			</VStack>
		);
	}

	return (
		<FlatList
			data={data}
			renderItem={renderItem}
			// ListFooterComponent={
			// 	<Center flex={1}>
			// 		<Icon as={Pause} size="lg" />
			// 	</Center>
			// }
		/>
	);
};
export default VocalizationsList;
