import { Fab, FabLabel } from '@gluestack-ui/themed';

import React, { useCallback, useEffect, useState } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { STORAGE_PATH } from '@env';
import useVocalizationsList from '../../hooks/useVocalizationsList';
import useStorage from '../../hooks/useStorage';
import CardPlay from '../../components/CardPlay';
import { Audio } from 'expo-av';
import { FlatList, Spinner, Text, VStack } from '@gluestack-ui/themed';
import { AudioWaveform, Play } from 'lucide-react-native';

const VocalizationsList = ({ route }) => {
	const { typeVocal, selectedListName } = route.params;
	const [sound, setSound] = useState('');
	const [soundChoose, setSoundChoose] = useState('');
	const { storage, storageRef } = useStorage({
		customPath: `${typeVocal}/${selectedListName}`,
	});
	const { data, loading } = useVocalizationsList({
		storageRef,
	});

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

	const playSound = async () => {
		if (sound) {
			const statusSound = await sound?.getStatusAsync();
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
	};

	const getTitleExercise = useCallback(
		urlPath => urlPath?.match(/\btraccia\s(?:\d{1,3})\b/i)?.[0],
		[],
	);

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

	/* --------------------------------- render --------------------------------- */

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
					placement={'bottom right'}
					showLabel={true}
					onPress={playSound}
					alignItems="center"
					bgColor={'$warning600'}
				>
					<FabLabel color="$black">
						{`STOP ${getTitleExercise(soundChoose)}`}
					</FabLabel>
				</Fab>
			)}
		</>
	);
};
export default VocalizationsList;
