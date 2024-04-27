import { Center, FlatList, Spinner } from '@gluestack-ui/themed';

import React, { useEffect, useState } from 'react';
import { STORAGE_PATH } from '@env';
import { getStorage, ref, getDownloadURL, list } from 'firebase/storage';
import CardPlay from '../../components/CardPlay';
import { CirclePlay } from 'lucide-react-native';
// import { Audio } from 'expo-av';

const VocalizationsList = ({ route }) => {
	const { typeVocal, selectedListName } = route.params;
	const [listVocalizzi, setListVocalizzi] = useState();
	const [loading, setLoading] = useState();

	/* ----------------------------- STORAGE REQUIRE ---------------------------- */
	const storage = getStorage();
	const endpoint = `${STORAGE_PATH}/${typeVocal}/${selectedListName}`;
	const storageRef = ref(storage, endpoint);

	useEffect(() => {
		const fetchAudio = async () => {
			setLoading(true);
			const listStorage = await list(storageRef);

			setListVocalizzi(listStorage?.items);
			setLoading(false);
		};

		fetchAudio();
	}, []);

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
			<Center flex={1}>
				<Spinner size="small" />
			</Center>
		);
	}

	return (
		<FlatList
			data={listVocalizzi}
			renderItem={renderItem}
			// ListFooterComponent={

			// }
		/>
	);
};
export default VocalizationsList;
