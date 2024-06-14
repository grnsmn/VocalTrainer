// src/screens/AuthScreen.js
import React, { useState, useEffect } from 'react';
import { View, Button, TextInput, Text, Alert } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

// // Initialize Firebase
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID",
// };
// initializeApp(firebaseConfig);

WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: 'YOUR_GOOGLE_CLIENT_ID',
  });

  const auth = getAuth();

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          Alert.alert('Logged in with Google!', `Welcome ${userCredential.user.email}`);
        })
        .catch((error) => {
          Alert.alert('Google login error', error.message);
        });
    }
  }, [response]);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        Alert.alert('Logged in!', `Welcome ${userCredential.user.email}`);
      })
      .catch((error) => {
        Alert.alert('Login error', error.message);
      });
  };

  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        Alert.alert('Account created!', `Welcome ${userCredential.user.email}`);
      })
      .catch((error) => {
        Alert.alert('Signup error', error.message);
      });
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderColor: 'gray' }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderColor: 'gray' }}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Sign Up" onPress={handleSignup} />
      <Button title="Login with Google" onPress={() => promptAsync()} disabled={!request} />
    </View>
  );
}
