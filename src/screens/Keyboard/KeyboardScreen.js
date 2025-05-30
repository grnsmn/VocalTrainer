import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { MidiProvider, PianoKeyboard } from 'react-native-piano-keyboard';

const KeyboardScreen = () => {
	const handleKeyPress = note => {
		console.log('Pressed note:', note);
	};

	return (
		<View style={styles.container}>
			<MidiProvider>
				<PianoKeyboard
					startKey="C2"
					endKey="C5"
					onPressKey={handleKeyPress}
					style={styles.keyboard}
				/>
			</MidiProvider>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	keyboard: {
		width: Dimensions.get('window').height, // Use height since we're in landscape
		height: '80%',
	},
});

export default KeyboardScreen;
