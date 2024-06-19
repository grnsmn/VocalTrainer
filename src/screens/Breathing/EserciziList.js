import { useState, useEffect } from 'react';
import { FlatList } from '@gluestack-ui/themed';
import CardSelect from '../../components/CardSelect';

const EserciziList = ({ route, navigation }) => {
	const { Titoli, famiglia } = route.params;
	const [listaTitoli, setListaTitoli] = useState(Object.values(Titoli));
	const [scelta, setScelta] = useState('');
	//console.log(Object.values(Titoli));

	useEffect(() => {
		navigation.setOptions({
			title: famiglia,
			headerTitleStyle: {
				fontSize: 24,
			},
		});
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
			data={listaTitoli}
			keyExtractor={item => item.id}
			renderItem={renderItem}
		/>
	);
};

export default EserciziList;
