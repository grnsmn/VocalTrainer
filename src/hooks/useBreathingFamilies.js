import { getDatabase, onValue, ref } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

const useBreathingFamilies = () => {
	const [families, setFamilies] = useState([]);
	const [loading, setLoading] = useState(true);

	const db = getDatabase();
	const refBreathingDB = ref(db, '/Respirazione/');

	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, user => {
			if (user) {
				let tmp = [];
				let famiglia = {};
				setFamilies([]);

				onValue(refBreathingDB, snapshot => {
					setLoading(true);
					snapshot.forEach(childSnap => {
						famiglia = {
							id: childSnap.key,
							contenuto: childSnap.val(),
						};

						tmp.push(famiglia);
					});
					setFamilies(tmp);
					setLoading(false);
				});
			} else {
				setLoading(false);
			}
		});

		return () => unsubscribe();
	}, []);

	return { families, loading };
};

export default useBreathingFamilies;
