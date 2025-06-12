import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import useStore from '../store';

/**
 * Hook per sincronizzare lo stato di autenticazione Firebase con Zustand.
 */
const useAuthSync = () => {
	const setAuth = useStore(state => state.setAuth);
	const clearAll = useStore(state => state.clearAll);

	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, user => {
			if (user) {
				// Salva solo i dati necessari
				setAuth({
					uid: user.uid,
					email: user.email,
					displayName: user.displayName,
				});
			} else {
				clearAll();
			}
		});
		return () => unsubscribe();
	}, [setAuth, clearAll]);
};

export default useAuthSync;
