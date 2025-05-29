import React from 'react';
import { MidiProvider, PianoKeyboard } from 'react-native-piano-keyboard';

const KeyboardScreen = () => {
	const handleKeyPress = note => {
		console.log('Pressed note:', note);
	};

	return (
		<MidiProvider>
			<PianoKeyboard
				startKey="C2"
				endKey="C4"
				onPressKey={handleKeyPress}
			/>
		</MidiProvider>
	);
};

export default KeyboardScreen;
