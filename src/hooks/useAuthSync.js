import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAuthStore } from '../store/auth';

/**
 * Hook per sincronizzare lo stato di autenticazione Firebase con Zustand.
 */
const useAuthSync = () => {
	const setAuth = useAuthStore(state => state.setAuth);
	const clearAuth = useAuthStore(state => state.clearAuth);

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
