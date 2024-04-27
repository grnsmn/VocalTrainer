import React from 'react';
import { FlatList, Spinner, Text, VStack } from '@gluestack-ui/themed';
import CardPlay from '../../components/CardPlay';
import { CirclePlay } from 'lucide-react-native';
import useVocalizationsList from '../../hooks/useVocalizationsList';
// import { Audio } from 'expo-av';

const VocalizationsList = ({ route }) => {
	const { typeVocal, selectedListName } = route.params;

	const { data, loading } = useVocalizationsList({
		typeVocal,
		listName: selectedListName,
	});

	const renderItem = ({ item }) => {
		const regex = /\btraccia\s(?:[1-9]|[1-9]\d|100)\b/i;
		const match = item?._location?.path.match(regex);

		if (match) {
			const title = match[0]; // Estrae la sottostringa corrispondente al pattern
			return (
				<CardPlay
					title={title}
					onPress={() => console.log('🚀 ~ testing')}
					RightIcon={CirclePlay}
				/>
			);
		} else {
			return null;
		}
	};

	if (loading) {
		return (
			<VStack
				flex={1}
				space="sm"
				justifyContent="center"
				alignItems="center"
			>
				<Spinner size="small" />
				<Text size="md">Please Wait</Text>
			</VStack>
		);
	}

	return (
		<FlatList
			data={data}
			renderItem={renderItem}
			// ListFooterComponent={

			// }
		/>
	);
};
export default VocalizationsList;
