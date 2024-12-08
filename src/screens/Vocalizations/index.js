import React from 'react';
import { FlatList } from '@gluestack-ui/themed';
import CardSelect from '../../components/CardSelect';
import { useNavigation } from '@react-navigation/native';
import Hero from '../../components/Hero';
import { CATEGORY_LIST } from '@env';

const categoryListArray = CATEGORY_LIST.split(',');

export const Vocalizations = () => {
	const navigation = useNavigation();

	const formatListName = route => {
		if (route === 'Apertura Vocali') {
			return 'AperturaVocali';
		} else {
			return route;
		}
	};

	const handlePress = listName => {
		navigation.navigate('Lista', {
			typeVocal: 'Uomo',
			selectedListName: formatListName(listName),
		});
	};

	const renderItem = ({ item }) => {
		return <CardSelect title={item} onPress={handlePress} />;
	};

	return (
		<FlatList
			bg={'$primary0'}
			data={categoryListArray}
			renderItem={renderItem}
			ListHeaderComponent={<Hero />}
		/>
	);
};
