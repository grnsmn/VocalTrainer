import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MidiProvider, PianoKeyboard } from 'react-native-piano-keyboard';
import AnimatedJumpNotes from '../../../assets/lotties/jump_notes.json';
import LottieView from 'lottie-react-native';

const KeyboardScreen = () => {
	const handleKeyPress = note => {
		// console.log('Pressed note:', note);
	};

	return (
		<View style={styles.container}>
			<LottieView
				webStyle={{ width: 250, height: 250 }}
				source={AnimatedJumpNotes}
				autoPlay
				loop={true}
				style={{ width: 50, height: 50 }}
			/>

			<MidiProvider>
				<PianoKeyboard
					startKey="C2"
					endKey="C5"
					onPressKey={handleKeyPress}
				/>
			</MidiProvider>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
});

export default KeyboardScreen;
