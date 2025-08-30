import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
// HeaderRight.js
import React from 'react';

import { getAuth, signOut } from 'firebase/auth';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

import { DoorOpen } from 'lucide-react-native';
import useStore from '../store';
import { Pressable } from '@/components/ui/pressable';

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
		<Pressable
			onPress={handleLogout}
			android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
			hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
			className="items-center justify-center web:p-2"
		>
			<Icon as={DoorOpen} size={24} className="text-primary-500" />
			<Text className="text-black font-medium">Logout</Text>
		</Pressable>
	);
};

export default HeaderRight;
