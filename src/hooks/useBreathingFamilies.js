import { getDatabase, onValue, ref, off } from 'firebase/database';
import { useEffect, useState } from 'react';

const useBreathingFamilies = () => {
	const [loading, setLoading] = useState(false);
	const [families, setFamilies] = useState([]);

	useEffect(() => {
		const db = getDatabase();
		const refBreathingDB = ref(db, '/families/');

		setLoading(true);

		const handleValue = snapshot => {
			const data = snapshot.val();
			const familiesArray = data ? Object.values(data) : [];
			setFamilies(familiesArray);
			setLoading(false);
		};

		onValue(refBreathingDB, handleValue);

		return () => {
			off(refBreathingDB, 'value', handleValue);
		};
	}, []);

	return { families, loading };
};

export default useBreathingFamilies;
