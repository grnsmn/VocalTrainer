import { Text } from "@/components/ui/text";
import { FormControl } from "@/components/ui/form-control";
import { ScrollView } from "@/components/ui/scroll-view";
import { VStack } from "@/components/ui/vstack";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
// src/screens/AuthScreen.js
import React, { useState } from 'react';
import { Alert, Platform } from 'react-native';

import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithPopup,
} from 'firebase/auth';
import Hero from '../../components/Hero';
import useStore from '../../store';
import { Eye, EyeOff } from 'lucide-react-native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

export default function AuthScreen() {
	const auth = getAuth();
	const provider = new GoogleAuthProvider();
	const { setItem } = useAsyncStorage('authData');

	const saveAuthData = async authData => {
		try {
			await setItem(JSON.stringify(authData));
		} catch (e) {
			console.error('Failed to save data to storage', e);
		}
	};

	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { auth: _auth, setAuth } = useStore();

	const onPressGoogle = async () => {
		const resp = await signInWithPopup(auth, provider);
		setAuth(resp);
		saveAuthData(resp);
	};

	const handleLogin = async () => {
		try {
			const { _tokenResponse } = await signInWithEmailAndPassword(
				auth,
				email,
				password,
			);
			setAuth(_tokenResponse);
			saveAuthData(_tokenResponse);
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
			saveAuthData(_tokenResponse);
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
        <ScrollView keyboardShouldPersistTaps="handled" className="bg-primary-0 grow-[1px]">
            <FormControl
                className="p-4 self-center rounded-lg  dark:border-1  dark:rounded-lg  dark:border-borderDark-800 max-w-[350px]">
				<Hero />
				<VStack space="xl">
					<VStack space="xs">
						<Text className="text-text-500 leading-xs">
							Email
						</Text>
						<Input className="bg-blueGray-200 rounded-2xl">
							<InputField type="text" onChangeText={setEmail} />
						</Input>
					</VStack>
					<VStack space="xs">
						<Text className="text-text-500 leading-xs">
							Password
						</Text>
						<Input className="text-center border bg-blueGray-200 rounded-2xl">
							<InputField
								type={showPassword ? 'text' : 'password'}
								onChangeText={setPassword}
							/>
							<InputSlot onPress={handleState} className="pr-3">
								<InputIcon
									as={showPassword ? Eye : EyeOff}
									className="text-darkBlue-500"
								/>
							</InputSlot>
						</Input>
					</VStack>
					<VStack space="lg">
						<Button onPress={handleLogin} className="bg-primary-500 rounded-2xl">
							<ButtonText className="text-white">Login</ButtonText>
						</Button>
						<Button onPress={handleSignup} className="bg-primary-500 rounded-2xl">
							<ButtonText className="text-white">Signup</ButtonText>
						</Button>
						{Platform.OS === 'web' && ( // Only show on web temporarily
							(<Button onPress={onPressGoogle} className="bg-primary-500 rounded-2xl">
                                <ButtonText className="text-white">
									Login with Google
								</ButtonText>
                            </Button>)
						)}
					</VStack>
				</VStack>
			</FormControl>
        </ScrollView>
    );
}
