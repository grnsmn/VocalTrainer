// HeaderRight.js
import React from 'react';
import { Pressable } from 'react-native';
import { Icon } from '@gluestack-ui/themed';
import { getAuth, signOut } from 'firebase/auth';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

import { LogOut, Settings } from 'lucide-react-native';
import useStore from '../store';

const HeaderRight = () => {
	const { clearAuth } = useStore();
	const { removeItem } = useAsyncStorage('authData');

	const handleLogout = () => {
		const auth = getAuth();
		signOut(auth).then(() => {
			removeItem();
			clearAuth();
		});
	};

	return (
		<Pressable onPress={handleLogout}>
			<Icon as={LogOut} color={'$primary500'} size={24} />
		</Pressable>
	);
};

export default HeaderRight;
