// src/screens/AuthScreen.js
import React, { useState } from 'react';
import { Alert, Platform } from 'react-native';

import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signInWithCredential,
	GoogleAuthProvider,
	signInWithPopup,
} from 'firebase/auth';
import {
	Button,
	ButtonText,
	Input,
	InputField,
	VStack,
	ScrollView,
} from '@gluestack-ui/themed';
import Hero from '../../components/Hero';
import useStore from '../../store';

export default function AuthScreen() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { auth: _auth, setAuth } = useStore();

	const auth = getAuth();
	const provider = new GoogleAuthProvider();

	const onPressGoogle = () => {
		signInWithPopup(auth, provider);
	};

	const handleLogin = async () => {
		try {
			const loginResp = await signInWithEmailAndPassword(
				auth,
				email,
				password,
			);
			console.log('🚀 ~ loginResp:', loginResp);
		} catch (error) {
			Alert.alert('Login error', error.message);
		}
	};

	const handleSignup = async () => {
		try {
			const { _tokenResponse } = await createUserWithEmailAndPassword(
				auth,
				email,
				password,
			);
			setAuth(_tokenResponse);
		} catch (error) {
			Alert.alert('Signup error', error.message);
		}
	};

	return (
		<ScrollView p={'$4'} bg="$primary0">
			<VStack space="sm" alignItems="center" justifyContent="center">
				<Hero />
				<Input borderWidth={1} borderRadius="lg">
					<InputField
						placeholder="Email"
						onChangeText={setEmail}
						bgColor="$blueGray200"
					/>
				</Input>
				<Input borderWidth={1} borderRadius="lg">
					<InputField
						placeholder="Password"
						onChangeText={setPassword}
						bgColor="$blueGray200"
						secureTextEntry
					/>
				</Input>
				<Button title="Login" onPress={handleLogin}>
					<ButtonText>Login</ButtonText>
				</Button>
				<Button onPress={handleSignup}>
					<ButtonText>Sign Up</ButtonText>
				</Button>
				{Platform.OS === 'web' && (
					<Button onPress={onPressGoogle}>
						<ButtonText>Login with Google</ButtonText>
					</Button>
				)}
			</VStack>
		</ScrollView>
	);
}
