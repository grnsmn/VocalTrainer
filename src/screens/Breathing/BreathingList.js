import { useState, useEffect } from 'react';
import { FlatList } from '@gluestack-ui/themed';
import CardSelect from '../../components/CardSelect';
import useStore from '../../store';
import { Audio } from 'expo-av';

const BreathingList = ({ route, navigation }) => {
	const { Titoli, famiglia } = route.params;
	const [listaTitoli, setListaTitoli] = useState(Object.values(Titoli));
	const [scelta, setScelta] = useState('');
	const { setSounds, sounds } = useStore();

	//console.log(Object.values(Titoli));

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
			headerTitleStyle: {
				fontSize: 24,
			},
		});

		loadSounds();
	}, []);

	const loadEsercizio = item => {
		setScelta(item);
	};

	useEffect(() => {
		if (scelta.length != 0) {
			let esercizioScelto = {};
			let esercizioNext = {};
			esercizioScelto = listaTitoli?.find(element => {
				return element.titolo == scelta;
			});

			let nextIndex = listaTitoli.indexOf(esercizioScelto) + 1;
			if (listaTitoli[nextIndex] != null) {
				esercizioNext = listaTitoli[nextIndex];
			}

			navigation.navigate('Training', {
				esercizio: esercizioScelto,
				next: esercizioNext,
			});

			// listaTitoli.forEach(element => {
			//   if (element.id===scelta){
			//     navigation.navigate('Training', {esercizio: element.contenuto})
			//   }
			// }
			// )
		}
		setScelta('');
	}, [scelta]);

	const renderItem = item => (
		<CardSelect title={item.item.titolo} onPress={loadEsercizio} />
	);

	return (
		<FlatList
			bg="$primary0"
			data={listaTitoli}
			keyExtractor={item => item.titolo}
			renderItem={renderItem}
		/>
	);
};

export default BreathingList;
