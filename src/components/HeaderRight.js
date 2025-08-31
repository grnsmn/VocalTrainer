import React from 'react';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { getAuth, signOut } from 'firebase/auth';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

import { DoorOpen } from 'lucide-react-native';
import useStore from '../store';
import { Pressable } from '@/components/ui/pressable';

const HeaderRight = () => {
	const { clearAuth } = useStore();
	const { removeItem } = useAsyncStorage('authData');

	const handleLogout = async () => {
		try {
			const auth = getAuth();
			await signOut(auth);
			// Clean up local state
			await removeItem();
			clearAuth();
		} catch (error) {}
	};

	return (
		<Pressable
			onPressOut={handleLogout} // workaround for issue with pressable onPress with react navigation in new architecture https://github.com/react-navigation/react-navigation/issues/12039
			android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }}
			className="items-center justify-center web:p-2 rounded-lg"
		>
			<Icon as={DoorOpen} size={24} className="text-primary-500" />
			<Text className="text-black font-medium">Logout</Text>
		</Pressable>
	);
};

export default HeaderRight;
