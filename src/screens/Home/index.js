import React from 'react';
import {
	Card,
	ChevronsRightIcon,
	FlatList,
	HStack,
	Heading,
	Icon,
	Pressable,
} from '@gluestack-ui/themed';
import CardSelect from '../../components/CardSelect';

const TYPES_OF_VOCALS = [{ label: 'Trilli' }, { label: 'Humming' }];

export const Home = () => {
	const handlePress = async () => {
		console.log('🚀 ~ testing');
	};

	const renderItem = ({ item }) => {
		const { label } = item;
		return <CardSelect title={label} onPress={handlePress} />;
	};

	return <FlatList data={TYPES_OF_VOCALS} renderItem={renderItem} />;
};
