import { FlatList, Text } from '@gluestack-ui/themed';

import React, { Suspense, useEffect, useState } from 'react';
import { STORAGE_PATH } from '@env';
import { getStorage, ref, getDownloadURL, list } from 'firebase/storage';
import CardSelect from '../../components/CardSelect';
// import { Audio } from 'expo-av';

const VocalizationsList = ({ route }) => {
	const { typeVocal, selectedListName } = route.params;
	const [listVocalizzi, setListVocalizzi] = useState();

	/* ----------------------------- STORAGE REQUIRE ---------------------------- */
	const storage = getStorage();
	const endpoint = `${STORAGE_PATH}/${typeVocal}/${selectedListName}`;
	const storageRef = ref(storage, endpoint);

	useEffect(() => {
		const setList = async () => {
			const listStorage = await list(storageRef);

			setListVocalizzi(listStorage?.items);
		};
		setList();
	}, []);

	const renderItem = ({ item }) => {
		const regex = /\btraccia\s(?:[1-9]|[1-9]\d|100)\b/i;
		const match = item?._location?.path.match(regex);

		if (match) {
			const title = match[0]; // Estrae la sottostringa corrispondente al pattern
			return (
				<CardSelect
					title={title}
					onPress={() => console.log('🚀 ~ testing')}
				/>
			);
		} else {
			return null;
		}
	};

	return (
		<Suspense fallback={<Text>loading...</Text>}>
			<FlatList
				data={listVocalizzi}
				renderItem={renderItem}
				// contentContainerStyle={styles.container}
				// ListFooterComponent={

				// }
			/>
		</Suspense>
	);
};
export default VocalizationsList;
