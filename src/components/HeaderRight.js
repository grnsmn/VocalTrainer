// HeaderRight.js
import React from 'react';
import { Icon, Text, VStack } from '@gluestack-ui/themed';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { LogOut } from 'lucide-react-native';
import useStore from '../store';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { getAuth, signOut } from 'firebase/auth';

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
		<TouchableOpacity style={styles.button} onPress={handleLogout}>
			<VStack alignItems={'center'} justifyContent={'center'} py={'$1'}>
				<Icon as={LogOut} color={'$primary500'} size={20} />
				<Text size="md">Logout</Text>
			</VStack>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
	},
	text: {
		marginLeft: 5,
		fontSize: 16,
	},
});

export default HeaderRight;
