import { FlatList } from '@/components/ui/flat-list';
import { Fab, FabLabel } from '@/components/ui/fab';
import React, { useCallback, useEffect, useState } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { STORAGE_PATH } from '@env';
import useVocalizationsList from '../../hooks/useVocalizationsList';
import useStorage from '../../hooks/useStorage';
import CardPlay from '../../components/CardPlay';
import Loader from '../../components/Loader';
import { useAudioPlayer } from 'expo-audio';
import { Play } from 'lucide-react-native';

const VocalizationsList = ({ route }) => {
	const { typeVocal, selectedListName } = route.params;
	const [soundChoose, setSoundChoose] = useState('');
	const [source, setSource] = useState(null);
	const player = useAudioPlayer(source);

	useEffect(() => {
		if (!source) {
			return;
		}

		player.play();
		// Cleanup function to stop the player when component unmounts or source changes
		return () => {
			if (player.playing) {
				player.pause();
				setSource(null);
				setSoundChoose('');
			}
		};
	}, [source, player]);

	const { storage, storageRef } = useStorage({
		customPath: `${typeVocal}/${selectedListName}`,
	});
	const { data, loading: isLoadingVocalizations } = useVocalizationsList({
		storageRef,
	});

	/* ---------------------- handle play vocalize sound --------------------- */
	const handlePlayPause = async path => {
		if (player.playing && soundChoose === path) {
			player.pause();
			setSource(null);
			setSoundChoose('');
			return;
		}

		if (player.playing) {
			player.pause();
		}

		setSoundChoose(path);

		try {
			const soundRef = ref(storage, `${STORAGE_PATH}/${path}`);
			const uri = await getDownloadURL(soundRef);
			setSource(uri);
		} catch (error) {
			console.error('Error getting download URL:', error);
		}
	};

	const stopSound = () => {
		if (player.isPlaying) {
			player.pause();
			setSource(null);
			setSoundChoose('');
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
		const title = getTitleExercise(pathVocalization);
		const chosen = getTitleExercise(soundChoose) === title;

		if (!title) {
			return null;
		}
		return (
			<CardPlay
				title={title}
				onPress={() => handlePlayPause(pathVocalization)}
				RightIcon={Play}
				isPlaying={chosen}
				isLoading={player.loading}
			/>
		);
	};

	/* --------------------------------- render --------------------------------- */

	if (isLoadingVocalizations) {
		return <Loader />;
	}

	return (
		<FlatList
			data={data}
			renderItem={renderItem}
			className="bg-primary-0"
			showsVerticalScrollIndicator={false}
		/>
	);
};
export default VocalizationsList;
