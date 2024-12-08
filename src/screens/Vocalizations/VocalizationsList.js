import React, { useCallback, useEffect, useState } from 'react';
import { Fab, FabLabel } from '@gluestack-ui/themed';
import { ref, getDownloadURL } from 'firebase/storage';
import { STORAGE_PATH } from '@env';
import useVocalizationsList from '../../hooks/useVocalizationsList';
import useStorage from '../../hooks/useStorage';
import CardPlay from '../../components/CardPlay';
import Loader from '../../components/Loader';
import { Audio } from 'expo-av';
import { FlatList } from '@gluestack-ui/themed';
import { Play } from 'lucide-react-native';

const VocalizationsList = ({ route }) => {
	const { typeVocal, selectedListName } = route.params;
	const [sound, setSound] = useState('');
	const [soundChoose, setSoundChoose] = useState('');
	const [isLoadingSound, setIsLoadingSound] = useState(false);
	const { storage, storageRef } = useStorage({
		customPath: `${typeVocal}/${selectedListName}`,
	});
	const { data, loading: isLoadingVocalizations } = useVocalizationsList({
		storageRef,
	});

	/* ---------------------- handle play vocalize sound --------------------- */
	useEffect(() => {
		const setAudio = async () => {
			if (soundChoose !== '') {
				setIsLoadingSound(true);
				const soundRef = ref(storage, `${STORAGE_PATH}/${soundChoose}`);
				if (soundRef) {
					const uri = await getDownloadURL(soundRef);
					// console.log('Loading Sound');
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
					// console.log('Unloading Sound');
					sound.unloadAsync();
			  }
			: undefined;
	}, [sound]);

	const playSound = async () => {
		if (sound) {
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
	};

	/* -------------------------------------------------------------------------- */

	const getTitleExercise = useCallback(
		urlPath =>
			urlPath
				?.replace('- uomini', '')
				?.match(/\btraccia\s(?:\d{1,3}(?:\s\w+)*)\b/i)?.[0],
		[],
	);

	const renderItem = ({ item }) => {
		const pathVocalization = item?._location?.path;
		console.log('🚀 ~ pathVocalization:', pathVocalization);
		const title = getTitleExercise(pathVocalization);
		const chosen = getTitleExercise(soundChoose) === title;

		if (title) {
			return (
				<CardPlay
					title={title}
					onPress={() => setSoundChoose(pathVocalization)}
					RightIcon={Play}
					isPlaying={chosen}
					isLoading={isLoadingSound && chosen}
				/>
			);
		}
	};

	/* --------------------------------- render --------------------------------- */

	if (isLoadingVocalizations) {
		return <Loader />;
	}

	return (
		<>
			<FlatList data={data} renderItem={renderItem} bg="$primary0" />
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
