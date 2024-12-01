import { STORAGE_PATH } from '@env';
import firebase from 'firebase/compat/app';

import { getStorage, ref } from 'firebase/storage';

const useStorage = ({ customPath } = {}) => {
	/* ----------------------------- STORAGE REQUIRE ---------------------------- */
	if (!firebase.apps.length) {
		return;
	}
	const storage = getStorage();
	const endpoint = `${STORAGE_PATH}/${customPath}`;
	const storageRef = ref(storage, endpoint);

	return { storage, storageRef };
};

export default useStorage;
