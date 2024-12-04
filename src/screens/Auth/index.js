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
	FormControl,
	Text,
	InputSlot,
	InputIcon,
} from '@gluestack-ui/themed';
import Hero from '../../components/Hero';
import useStore from '../../store';
import { Eye, EyeOff } from 'lucide-react-native';

export default function AuthScreen() {
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { auth: _auth, setAuth } = useStore();

	const onPressGoogle = async () => {
		const auth = getAuth();
		const provider = new GoogleAuthProvider();
		const resp = await signInWithPopup(auth, provider);
		setAuth(resp);
	};

	const handleLogin = async () => {
		try {
			const loginResp = await signInWithEmailAndPassword(
				auth,
				email,
				password,
			);
			setAuth(loginResp);
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

	const handleState = () => {
		setShowPassword(showState => {
			return !showState;
		});
	};

	return (
		<ScrollView bg="$primary0">
			<FormControl
				p="$4"
				alignSelf="center"
				borderRadius="$lg"
				$dark-borderWidth="$1"
				$dark-borderRadius="$lg"
				$dark-borderColor="$borderDark800"
				maxWidth={350}
			>
				<Hero />
				<VStack space="xl">
					<VStack space="xs">
						<Text color="$text500" lineHeight="$xs">
							Email
						</Text>
						<Input bgColor="$blueGray200" borderRadius="$2xl">
							<InputField type="text" onChangeText={setEmail} />
						</Input>
					</VStack>
					<VStack space="xs">
						<Text color="$text500" lineHeight="$xs">
							Password
						</Text>
						<Input
							textAlign="center"
							borderWidth={1}
							bgColor="$blueGray200"
							borderRadius="$2xl"
						>
							<InputField
								type={showPassword ? 'text' : 'password'}
								onChangeText={setPassword}
							/>
							<InputSlot pr="$3" onPress={handleState}>
								<InputIcon
									as={showPassword ? Eye : EyeOff}
									color="$darkBlue500"
								/>
							</InputSlot>
						</Input>
					</VStack>
					<VStack space="lg">
						<Button
							bgColor="$primary500"
							borderRadius="$2xl"
							onPress={handleLogin}
						>
							<ButtonText color="$white">Login</ButtonText>
						</Button>
						<Button
							bgColor="$primary500"
							borderRadius="$2xl"
							onPress={handleSignup}
						>
							<ButtonText color="$white">Signup</ButtonText>
						</Button>
						{Platform.OS === 'web' && ( // Only show on web temporarily
							<Button
								bgColor="$primary500"
								borderRadius="$2xl"
								onPress={onPressGoogle}
							>
								<ButtonText color="$white">
									Login with Google
								</ButtonText>
							</Button>
						)}
					</VStack>
				</VStack>
			</FormControl>
		</ScrollView>
	);
}
