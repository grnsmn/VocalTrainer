import { ScrollView } from '@/components/ui/scroll-view';
import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
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
		<View className="flex-1 h-full">
			<ScrollView className="grow-[1px] h-full">
				<Text className="text-xl leading-[24px] text-center italic my-4 px-1 ">
					{exercice?.dewcription}
				</Text>
				<BreathingSession exercise={exercice} />
			</ScrollView>
		</View>
	);
};

export default TrainingScreen;
