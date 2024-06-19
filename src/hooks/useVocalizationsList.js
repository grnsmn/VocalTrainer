import { useEffect, useState } from 'react';
import { list } from 'firebase/storage';

const useVocalizationsList = ({ storageRef }) => {
	const [data, setData] = useState();
	const [loading, setLoading] = useState();

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
