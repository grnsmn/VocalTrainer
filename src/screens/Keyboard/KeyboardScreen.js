import React from 'react';
import { StyleSheet } from 'react-native';
import { MidiProvider, PianoKeyboard } from 'react-native-piano-keyboard';
import AnimatedJumpNotes from '../../../assets/lotties/jump_notes.json';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const KeyboardScreen = () => {
	const handleKeyPress = note => {
		// console.log('Pressed note:', note);
	};

	return (
		<LinearGradient
			colors={[ '#FFFF', '#CCE9FF']}
			style={styles.container}
		>
			<LottieView
				webStyle={{ width: 250, height: 250 }}
				source={AnimatedJumpNotes}
				autoPlay
				loop={true}
				style={{ width: 50, height: 50, flex: 1 }}
			/>
		<LinearGradient
			colors={[ '#FFFF', '#080808']}
			style={styles.keyboard}
		>

			<MidiProvider>
				<PianoKeyboard
					startKey="C2"
					endKey="C5"
					onPressKey={handleKeyPress}
				/>
			</MidiProvider>
		</LinearGradient>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	keyboard: {
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		overflow: 'hidden',
	},
});

export default KeyboardScreen;
