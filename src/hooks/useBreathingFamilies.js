import { getDatabase, onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import useStore from '../store';
import test from '../../test.json';

const useBreathingFamilies = () => {
	const [loading, setLoading] = useState(false);
	const [families, setFamilies] = useState([]);

	const db = getDatabase();
	const refBreathingDB = ref(db, '/families/');

	useEffect(() => {
		let tmp = [];
		let famiglia = {};
		setFamilies([]);

		onValue(
			refBreathingDB,
			snapshot => {
				setLoading(true);
				snapshot?.forEach(childSnap => {
					console.log('🚀 ~ childSnap:', childSnap.val());
					famiglia = childSnap.val();

					tmp.push(famiglia);
				});
				setFamilies(tmp);
				setLoading(false);
			},
			error => {
				setAuth(undefined); // android: workaround to force logout when error occurs to fetch data
			},
		);
	}, []);

	return { families: test.families, loading };
};

export default useBreathingFamilies;
