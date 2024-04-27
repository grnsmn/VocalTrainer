import { Text, Box } from '@gluestack-ui/themed';

import React from 'react';
import { getStorage, ref, getDownloadURL, list } from 'firebase/storage';
// import { Audio } from 'expo-av';
// import { STORAGE_PATH } from '@env';

const VocalizationsList = () => {
	const storage = getStorage();

	return (
		<Box flex={1} justifyContent="center" alignItems="center">
			<Text color="white" fontWeight="$bold">
				BOX
			</Text>
		</Box>
	);
};
export default VocalizationsList;
