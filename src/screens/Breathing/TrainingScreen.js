import { ScrollView } from '@/components/ui/scroll-view';
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import BreathingSession from '../../components/Breath';
// import Metronome from '../components/MetronomeHook'

const TrainingScreen = ({ route, navigation }) => {
	const { exercice } = route?.params;

	useEffect(() => {
		navigation.setOptions({
			title: exercice?.name,
			headerTitleAlign: 'center',
			headerStyle: {
				backgroundColor: '#c6e9ff',
			},
			headerTitleStyle: {
				fontWeight: 'bold',
				fontSize: 24,
				textAlign: 'center',
			},
		});
	}, []);

	return (
		<ScrollView className="grow-[1px] h-full bg-primary-0">
			<BreathingSession exercise={exercice} />
		</ScrollView>
	);
};

export default TrainingScreen;
