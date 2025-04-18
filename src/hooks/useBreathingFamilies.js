import { getDatabase, onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import useStore from '../store';

const useBreathingFamilies = () => {
	const { setAuth } = useStore();
	const [families, setFamilies] = useState([]);
	const [loading, setLoading] = useState(true);

	const db = getDatabase();
	const refBreathingDB = ref(db, '/Respirazione/');

	useEffect(() => {
		let tmp = [];
		let famiglia = {};
		setFamilies([]);

		onValue(
			refBreathingDB,
			snapshot => {
				setLoading(true);
				snapshot?.forEach(childSnap => {
					famiglia = {
						id: childSnap.key,
						contenuto: childSnap.val(),
					};

					tmp.push(famiglia);
				});
				setFamilies(tmp);
				setLoading(false);
			},
			error => {
				console.error(error);
			},
		);
	}, []);

	return { families, loading };
};

export default useBreathingFamilies;
