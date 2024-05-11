import { Fab, FabIcon, FabLabel, HStack } from '@gluestack-ui/themed';

import React, { useEffect, useState } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { STORAGE_PATH } from '@env';
import useVocalizationsList from '../../hooks/useVocalizationsList';
import useStorage from '../../hooks/useStorage';
import CardPlay from '../../components/CardPlay';
import { Audio } from 'expo-av';
import { FlatList, Spinner, Text, VStack } from '@gluestack-ui/themed';
import { AudioWaveform, Pause, Play } from 'lucide-react-native';

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
	const [isLoadingSound, setIsLoadingSound] = useState(false);

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
			setIsLoadingSound(true);
			const statusSound = await sound?.getStatusAsync();
			setIsLoadingSound(false);
			if (!statusSound.isPlaying) {
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

	const getTitleExercise = urlPath => {
		if (urlPath) {
			const regex = /\btraccia\s(?:[1-9]|[1-9]\d|100)\b/i;
			return urlPath?.match(regex)[0];
		}
	};

	const renderItem = ({ item }) => {
		const title = getTitleExercise(item?._location?.path);
		const playing = getTitleExercise(soundChoose) === title;

		if (title) {
			return (
				<CardPlay
					title={title}
					onPress={() => setSoundChoose(item?._location?.path)}
					RightIcon={playing ? AudioWaveform : Play}
					isPlaying={playing}
				/>
			);
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
		<>
			<FlatList data={data} renderItem={renderItem} />
			{!!sound && (
				<Fab
					placement={'bottom center'}
					showLabel={true}
					onPress={playSound}
					alignItems="center"
				>
					<VStack alignItems="center" space={3}>
						<FabLabel>In riproduzione</FabLabel>
						<HStack alignItems="center">
							{/* <FabIcon as={StopCircle} m={'$1'} /> */}
							<FabLabel>{getTitleExercise(soundChoose)}</FabLabel>
						</HStack>
					</VStack>
				</Fab>
			)}
		</>
	);
};
export default VocalizationsList;
