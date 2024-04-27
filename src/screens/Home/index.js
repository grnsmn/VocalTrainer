import React from 'react';
import { FlatList } from '@gluestack-ui/themed';
import CardSelect from '../../components/CardSelect';

const CATEGORY_LIST = ['Trillo', 'Humming', 'Gne', 'Apertura Vocali', 'Solo'];

export const Home = () => {
	const handlePress = () => {
		console.log('🚀 ~ testing');
	};

	const renderItem = ({ item }) => {
		return <CardSelect title={item} onPress={handlePress} />;
	};

	return <FlatList data={CATEGORY_LIST} renderItem={renderItem} />;
};
