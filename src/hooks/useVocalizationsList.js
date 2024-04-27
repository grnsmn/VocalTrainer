import { useEffect, useState } from 'react';
import { STORAGE_PATH } from '@env';
import { getStorage, ref, getDownloadURL, list } from 'firebase/storage';

const useVocalizationsList = ({ typeVocal, listName }) => {
	const [data, setData] = useState();
	const [loading, setLoading] = useState();

	/* ----------------------------- STORAGE REQUIRE ---------------------------- */
	const storage = getStorage();
	const endpoint = `${STORAGE_PATH}/${typeVocal}/${listName}`;
	const storageRef = ref(storage, endpoint);

	useEffect(() => {
		const fetchAudio = async () => {
			setLoading(true);
			const listStorage = await list(storageRef);

			setData(listStorage?.items);
			setLoading(false);
		};

		fetchAudio();
	}, []);

	return {
		data,
		loading,
	};
};

export default useVocalizationsList;
