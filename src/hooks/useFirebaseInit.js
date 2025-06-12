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
import { useEffect } from 'react';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

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

	useEffect(() => {
		if (!firebase.apps.length) {
			const app = firebase.initializeApp(firebaseConfig);
			if (Platform.OS !== 'web') {
				initializeAuth(app, {
					persistence: getReactNativePersistence(
						ReactNativeAsyncStorage,
					),
				});
			}
		} else {
			firebase.app(); // if already initialized, use that one
		}
	}, [firebase]);
};

export default useFirebaseInit;
