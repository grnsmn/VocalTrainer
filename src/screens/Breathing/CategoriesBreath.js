import React from 'react';
import { FlatList } from '@gluestack-ui/themed';
import useBreathingFamilies from '../../hooks/useBreathingFamilies';
import CardSelect from '../../components/CardSelect';
import Loader from '../../components/Loader';

const CategoriesBreath = ({ navigation }) => {
	const { families, loading: isLoadingBreathCategories } =
		useBreathingFamilies();

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

	if (isLoadingBreathCategories) {
		return <Loader />;
	}

	return (
		<FlatList
			data={families}
			keyExtractor={item => item.id}
			renderItem={renderItem}
		/>
	);
};

export default CategoriesBreath;
