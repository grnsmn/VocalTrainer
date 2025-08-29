// HeaderRight.js
import React from 'react';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Pressable } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

import { LogOut } from 'lucide-react-native';
import useStore from '../store';

const HeaderRight = () => {
	const { clearAuth } = useStore();
	const { removeItem } = useAsyncStorage('authData');

	const handleLogout = async () => {
		const auth = getAuth();
		signOut(auth).then(() => {
			removeItem();
			clearAuth();
		});
	};

	return (
		<Pressable onPress={handleLogout}>
			<VStack className="items-center justify-center p-2">
				<Icon as={LogOut} size={24} className="text-primary-600" />
				<Text>Logout</Text>
			</VStack>
		</Pressable>
	);
};

export default HeaderRight;
