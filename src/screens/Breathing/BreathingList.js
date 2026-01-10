import { FlatList } from '@/components/ui/flat-list';
import { useEffect } from 'react';
import CardSelect from '../../components/CardSelect';

const BreathingList = ({ route, navigation }) => {
	const { exercices, famiglia } = route.params;
	// Audio players rimossi: ora gestiti dal hook useMetronome in Bullet.js

	useEffect(() => {
		navigation.setOptions({
			title: famiglia,
		});
	}, [famiglia, navigation]);

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
			keyExtractor={item => item?.id}
			renderItem={renderItem}
			className="bg-primary-0"
			showsVerticalScrollIndicator={false}
		/>
	);
};

export default BreathingList;
