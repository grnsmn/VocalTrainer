import { FlatList } from '@/components/ui/flat-list';
import React, { useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import useVocalizationsList from '../../hooks/useVocalizationsList';
import useStorage from '../../hooks/useStorage';
import { useAudioControl } from '../../hooks/useAudioControl';
import CardPlay from '../../components/CardPlay';
import Loader from '../../components/Loader';
import { Play } from 'lucide-react-native';

const VocalizationsList = ({ route }) => {
	const { typeVocal, selectedListName } = route.params;

	const { storage, storageRef } = useStorage({
		customPath: `${typeVocal}/${selectedListName}`,
	});

	const { player, soundChoose, handlePlayPause, stopSound, source } =
		useAudioControl(storage);

	const { data, loading: isLoadingVocalizations } = useVocalizationsList({
		storageRef,
	});

	useEffect(() => {
		if (!source) return;

		player.play();
		return () => {
			if (player.playing) stopSound();
		};
	}, [source, player]);

	useFocusEffect(
		useCallback(() => {
			return () => {
				if (player.playing) stopSound();
			};
		}, [player]),
	);

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

		if (!title) return null;

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
