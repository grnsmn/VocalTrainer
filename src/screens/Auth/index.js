// src/screens/AuthScreen.js
import React, { useState, useEffect } from 'react';
import { View, Button, TextInput, Text, Alert, Platform } from 'react-native';
import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signInWithCredential,
	GoogleAuthProvider,
} from 'firebase/auth';

export default function AuthScreen() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const auth = getAuth();
	const provider = new GoogleAuthProvider();

	// const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
	//   clientId: 'YOUR_GOOGLE_CLIENT_ID',
	// });

	const onPressGoogle = () => {
		signInWithRedirect(auth, provider);
	};

	console.log('🚀 ~ auth:', auth);

	// useEffect(() => {
	//   if (response?.type === 'success') {
	//     const { id_token } = response.params;
	//     const credential = GoogleAuthProvider.credential(id_token);
	//     signInWithCredential(auth, credential)
	//       .then((userCredential) => {
	//         Alert.alert('Logged in with Google!', `Welcome ${userCredential.user.email}`);
	//       })
	//       .catch((error) => {
	//         Alert.alert('Google login error', error.message);
	//       });
	//   }
	// }, [response]);

	const handleLogin = () => {
		signInWithEmailAndPassword(auth, email, password)
			.then(userCredential => {
				Alert.alert(
					'Logged in!',
					`Welcome ${userCredential.user.email}`,
				);
			})
			.catch(error => {
				Alert.alert('Login error', error.message);
			});
	};

	const handleSignup = () => {
		createUserWithEmailAndPassword(auth, email, password)
			.then(userCredential => {
				Alert.alert(
					'Account created!',
					`Welcome ${userCredential.user.email}`,
				);
			})
			.catch(error => {
				Alert.alert('Signup error', error.message);
			});
	};

	return (
		<View style={{ padding: 20 }}>
			<TextInput
				placeholder="Email"
				value={email}
				onChangeText={setEmail}
				style={{
					marginBottom: 20,
					padding: 10,
					borderWidth: 1,
					borderColor: 'gray',
				}}
			/>
			<TextInput
				placeholder="Password"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
				style={{
					marginBottom: 20,
					padding: 10,
					borderWidth: 1,
					borderColor: 'gray',
				}}
			/>
			<Button title="Login" onPress={handleLogin} />
			<Button title="Sign Up" onPress={handleSignup} />
			{Platform.OS === 'web' && (
				<Button title="Login with Google" onPress={onPressGoogle} />
			)}
		</View>
	);
}
