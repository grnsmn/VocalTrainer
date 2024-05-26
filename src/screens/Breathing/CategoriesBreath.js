import React from 'react';
import { FlatList } from '@gluestack-ui/themed';
import useBreathingFamilies from '../../hooks/useBreathingFamilies';
import CardSelect from '../../components/CardSelect';

const CategoriesBreath = ({ navigation }) => {
	const families = useBreathingFamilies();

	const onPressHandler = ({ item }) => {
		navigation.navigate('BreathingList', {
			Titoli: item?.contenuto,
			famiglia: item?.id,
		});
	};

	const renderItem = item => {
		return (
			<CardSelect
				title={item.item.id}
				onPress={() => onPressHandler(item)}
			/>
		);
	};

	return (
		<FlatList
			data={families}
			keyExtractor={item => item.id}
			renderItem={renderItem}
		/>
	);
};

export default CategoriesBreath;
