import React, { useState } from 'react';
import { FlatList } from '@gluestack-ui/themed';
import useBreathingFamilies from '../../hooks/useBreathingFamilies';
import CardSelect from '../../components/CardSelect';

const CategoriesBreath = ({ navigation }) => {
	const families = useBreathingFamilies();

	const renderItem = item => {
		return (
			<CardSelect
				title={item.item.id}
				// onPressItem={onPressHandler}
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
