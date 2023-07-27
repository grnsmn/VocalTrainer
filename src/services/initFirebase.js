import firebase from 'firebase/compat/app';
import {
	API_KEY,
	AUTH_DOMAIN,
	DATABASE_URL,
	PROJECT_ID,
	STORAGE_BUCKET,
	MESSAGING_SENDER_ID,
	APP_ID,
	MEASUREMENT_ID,
} from '@env';

const useFirebaseInit = () => {
	const firebaseConfig = {
		apiKey: API_KEY,
		authDomain: AUTH_DOMAIN,
		databaseURL: DATABASE_URL,
		projectId: PROJECT_ID,
		storageBucket: STORAGE_BUCKET,
		messagingSenderId: MESSAGING_SENDER_ID,
		appId: APP_ID,
		measurementId: MEASUREMENT_ID,
	};

	// Inizializza Firebase solo se non è già stato inizializzato
	if (!firebase.apps.length) {
		firebase.initializeApp(firebaseConfig);
	} else {
		firebase.app(); // if already initialized, use that one
	}
};

export default useFirebaseInit;
