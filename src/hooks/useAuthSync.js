import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import useStore from '../store';

/**
 * Hook per sincronizzare lo stato di autenticazione Firebase con Zustand.
 */
const useAuthSync = () => {
	const setAuth = useStore(state => state.setAuth);
	const clearAuth = useStore(state => state.clearAuth);

	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, user => {
			if (user) {
				setAuth({
					uid: user.uid,
					email: user.email,
					displayName: user.displayName,
				});
			} else {
				clearAuth();
			}
		});
		return () => unsubscribe();
	}, [setAuth, clearAuth]);
};

export default useAuthSync;
