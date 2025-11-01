import { FlatList } from '@/components/ui/flat-list';
import { useState, useEffect } from 'react';
import CardSelect from '../../components/CardSelect';
import useStore from '../../store';
import { Audio } from 'expo-av';

const BreathingList = ({ route, navigation }) => {
	const { exercices, famiglia } = route.params;
	const { setSounds } = useStore();

	useEffect(() => {
		const loadSounds = async () => {
			const click1 = await Audio.Sound.createAsync(
				require('../../../assets/sounds/click1.mp3'),
			);
			const click2 = await Audio.Sound.createAsync(
				require('../../../assets/sounds/click2.mp3'),
			);

			setSounds({
				click1: click1.sound,
				click2: click2.sound,
			});
		};

		navigation.setOptions({
			title: famiglia,
		});

		loadSounds();
	}, []);

	const onPressExercice = item => {
		navigation.navigate('Training', {
			exercice: exercices.find(element => element.name === item),
		});
	};

	const renderItem = item => (
		<CardSelect
			key={item.id}
			title={item.item.name}
			onPress={onPressExercice}
		/>
	);

	return (
		<FlatList
			data={exercices}
			keyExtractor={item => item.titolo}
			renderItem={renderItem}
			className="bg-primary-0"
			showsVerticalScrollIndicator={false}
		/>
	);
};

export default BreathingList;
