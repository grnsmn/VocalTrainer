import { Text } from '@/components/ui/text';
import {
	FormControl,
	FormControlError,
	FormControlErrorText,
	FormControlErrorIcon,
} from '@/components/ui/form-control';
import { ScrollView } from '@/components/ui/scroll-view';
import { VStack } from '@/components/ui/vstack';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { AlertCircleIcon } from '@/components/ui/icon';
import { Alert, AlertText, AlertIcon } from '@/components/ui/alert';
// src/screens/AuthScreen.js
import React, { useState } from 'react';
import { Platform } from 'react-native';

import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithPopup,
} from 'firebase/auth';
import Hero from '../../components/Hero';
import useStore from '../../store';
import { Eye, EyeOff, X } from 'lucide-react-native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

export default function AuthScreen() {
	const auth = getAuth();
	const provider = new GoogleAuthProvider();
	const { setItem } = useAsyncStorage('authData');
	const { auth: _auth, setAuth } = useStore();

	const [formData, setFormData] = useState({
		email: '',
		password: '',
		showPassword: false,
		errors: {
			email: '',
			password: '',
			general: '',
		},
	});

	const saveAuthData = async authData => {
		try {
			await setItem(JSON.stringify(authData));
		} catch (e) {
			console.error('Failed to save data to storage', e);
		}
	};

	const updateFormData = (field, value) => {
		setFormData(prev => ({
			...prev,
			[field]: value,
			errors: {
				...prev.errors,
				[field]: '',
				general: '',
			},
		}));
	};

	const updateErrors = errors => {
		setFormData(prev => ({
			...prev,
			errors: {
				...prev.errors,
				...errors,
			},
		}));
	};

	const clearEmail = () => {
		updateFormData('email', '');
	};

	const onPressGoogle = async () => {
		const resp = await signInWithPopup(auth, provider);
		setAuth(resp);
		saveAuthData(resp);
	};

	const handleLogin = async () => {
		try {
			const { email, password } = formData;

			if (!email) {
				updateErrors({ email: 'Email è richiesta' });
				return;
			}
			if (!password) {
				updateErrors({ password: 'Password è richiesta' });
				return;
			}

			const { _tokenResponse } = await signInWithEmailAndPassword(
				auth,
				email,
				password,
			);
			setAuth(_tokenResponse);
			saveAuthData(_tokenResponse);
		} catch (error) {
			updateErrors({ general: error.message });
		}
	};

	const handleSignup = async () => {
		try {
			const { email, password } = formData;

			if (!email) {
				updateErrors({ email: 'Email è richiesta' });
				return;
			}
			if (!password) {
				updateErrors({ password: 'Password è richiesta' });
				return;
			}
			if (password.length < 6) {
				updateErrors({
					password: 'La password deve essere di almeno 6 caratteri',
				});
				return;
			}

			const { _tokenResponse } = await createUserWithEmailAndPassword(
				auth,
				email,
				password,
			);
			setAuth(_tokenResponse);
			saveAuthData(_tokenResponse);
		} catch (error) {
			updateErrors({ general: error.message });
		}
	};

	const togglePasswordVisibility = () => {
		setFormData(prev => ({
			...prev,
			showPassword: !prev.showPassword,
		}));
	};

	return (
		<ScrollView
			keyboardShouldPersistTaps="handled"
			className="bg-primary-0 grow-[1px]"
		>
			<FormControl className="p-4 self-center rounded-lg  dark:border-1  dark:rounded-lg  dark:border-borderDark-800 max-w-[350px]">
				<Hero />
				<VStack space="xl">
					{formData.errors.general && (
						<Alert action="error" variant="solid">
							<AlertIcon as={AlertCircleIcon} />
							<AlertText>{formData.errors.general}</AlertText>
						</Alert>
					)}
					<VStack space="xs">
						<Text className="text-text-500 leading-xs">Email</Text>
						<FormControl isInvalid={!!formData.errors.email}>
							<Input className="bg-blueGray-200 rounded-2xl">
								<InputField
									type="text"
									value={formData.email}
									onChangeText={value =>
										updateFormData('email', value)
									}
								/>
								{formData.email && (
									<InputSlot
										onPress={clearEmail}
										className="pr-3"
									>
										<InputIcon
											as={X}
											className="text-darkBlue-500"
										/>
									</InputSlot>
								)}
							</Input>
							<FormControlError>
								<FormControlErrorIcon as={AlertCircleIcon} />
								<FormControlErrorText>
									{formData.errors.email}
								</FormControlErrorText>
							</FormControlError>
						</FormControl>
					</VStack>
					<VStack space="xs">
						<Text className="text-text-500 leading-xs">
							Password
						</Text>
						<FormControl isInvalid={!!formData.errors.password}>
							<Input className="text-center border bg-blueGray-200 rounded-2xl">
								<InputField
									type={
										formData.showPassword
											? 'text'
											: 'password'
									}
									value={formData.password}
									onChangeText={value =>
										updateFormData('password', value)
									}
								/>
								<InputSlot
									onPress={togglePasswordVisibility}
									className="pr-3"
								>
									<InputIcon
										as={
											formData.showPassword ? Eye : EyeOff
										}
										className="text-darkBlue-500"
									/>
								</InputSlot>
							</Input>
							<FormControlError>
								<FormControlErrorIcon as={AlertCircleIcon} />
								<FormControlErrorText>
									{formData.errors.password}
								</FormControlErrorText>
							</FormControlError>
						</FormControl>
					</VStack>
					<VStack space="lg">
						<Button
							onPress={handleLogin}
							className="bg-primary-500 rounded-2xl"
						>
							<ButtonText className="text-white">
								Login
							</ButtonText>
						</Button>
						<Button
							onPress={handleSignup}
							className="bg-primary-500 rounded-2xl"
						>
							<ButtonText className="text-white">
								Signup
							</ButtonText>
						</Button>
						{Platform.OS === 'web' && ( // Only show on web temporarily
							<Button
								onPress={onPressGoogle}
								className="bg-primary-500 rounded-2xl"
							>
								<ButtonText className="text-white">
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
