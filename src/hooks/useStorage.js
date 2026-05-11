import { STORAGE_PATH } from '@env';
import { getApps } from 'firebase/app';
import { getStorage, ref } from 'firebase/storage';

const useStorage = ({ customPath } = {}) => {
	if (!getApps().length) {
		return {}; // Return empty object to prevent destructuring errors (const { storage } = ...)
	}
	const storage = getStorage();
	const endpoint = `${STORAGE_PATH}/${customPath || ''}`;
	const storageRef = ref(storage, endpoint);

	return { storage, storageRef };
};

export default useStorage;
