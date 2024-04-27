import React from 'react';
import { FlatList } from '@gluestack-ui/themed';
import CardSelect from '../../components/CardSelect';
import { useNavigation } from '@react-navigation/native';

const CATEGORY_LIST = ['Trillo', 'Humming', 'Gne', 'Apertura Vocali', 'Solo'];

export const Vocalizations = () => {
	const navigation = useNavigation();

	const handlePress = listName => {
		navigation.navigate('Lista', {
			typeVocal: 'Uomo',
			selectedListName: listName,
		});
	};

	const renderItem = ({ item }) => {
		return <CardSelect title={item} onPress={handlePress} />;
	};

	return <FlatList data={CATEGORY_LIST} renderItem={renderItem} />;
};
