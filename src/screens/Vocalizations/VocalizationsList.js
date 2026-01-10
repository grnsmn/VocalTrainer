import { FlatList } from '@/components/ui/flat-list';
import React, { useCallback } from 'react';
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

	const { selectedSound, isPlaying, isLoading, handlePlayPause, stopSound } =
		useAudioControl(storage);

	const { data, loading: isLoadingVocalizations } = useVocalizationsList({
		storageRef,
	});

	useFocusEffect(
		useCallback(() => {
			return () => stopSound();
		}, [stopSound]),
	);

	const extractTitle = useCallback(
		path =>
			path
				?.replace('- uomini', '')
				?.match(/\btraccia\s(?:\d{1,3}(?:\s\w+)*)\b/i)?.[0],
		[],
	);

	const renderItem = ({ item }) => {
		const path = item?._location?.path;
		const title = extractTitle(path);
		const isSelected = extractTitle(selectedSound) === title;

		if (!title) return null;

		return (
			<CardPlay
				title={title}
				onPress={() => handlePlayPause(path)}
				RightIcon={Play}
				isPlaying={isSelected && isPlaying}
				isLoading={isSelected && isLoading}
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

