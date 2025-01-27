import React from 'react';
import { FlatList } from '@gluestack-ui/themed';
import useBreathingFamilies from '../../hooks/useBreathingFamilies';
import CardSelect from '../../components/CardSelect';
import Loader from '../../components/Loader';
import Hero from '../../components/Hero';

const CategoriesBreath = ({ navigation }) => {
	const { families, loading: isLoadingBreathCategories } =
		useBreathingFamilies();

	const onPressHandler = ({ item }) => {
		navigation.navigate('BreathingList', {
			exercices: item?.exercises,
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
			bg="$primary0"
			data={families}
			keyExtractor={item => item.id}
			renderItem={renderItem}
			ListHeaderComponent={<Hero />}
		/>
	);
};

export default CategoriesBreath;
