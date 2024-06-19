import { STORAGE_PATH } from '@env';
import { getStorage, ref } from 'firebase/storage';

const useStorage = ({ customPath }) => {
	/* ----------------------------- STORAGE REQUIRE ---------------------------- */
	const storage = getStorage();
	const endpoint = `${STORAGE_PATH}/${customPath}`;
	const storageRef = ref(storage, endpoint);

	return { storage, storageRef };
};

export default useStorage;
