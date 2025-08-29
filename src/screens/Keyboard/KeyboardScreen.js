import React from 'react';
import { StyleSheet } from 'react-native';
import { MidiProvider, PianoKeyboard } from 'react-native-piano-keyboard';
import AnimatedVoiceLines from '../../../assets/lotties/voice_lines.json';
import AnimatedSpeaker from '../../../assets/lotties/speaker_playing.json';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const KeyboardScreen = () => {
	const handleKeyPress = note => {
		// console.log('Pressed note:', note);
	};

	return (
		<>
			<LinearGradient
				colors={['#CCE9FF', 'transparent']}
				style={styles.container}
			>
				<LottieView
					webStyle={{ width: 200, height: 200 }}
					source={AnimatedSpeaker}
					autoPlay
					loop={true}
					style={{
						width: 50,
						height: 50,
					}}
				/>
				<LottieView
					webStyle={{ width: 400, height: 300 }}
					source={AnimatedVoiceLines}
					autoPlay
					loop={true}
					style={{
						width: 200,
						height: 120,
					}}
				/>
				<LottieView
					webStyle={{ width: 200, height: 200 }}
					source={AnimatedSpeaker}
					autoPlay
					loop={true}
					style={{
						width: 50,
						height: 50,
					}}
				/>
			</LinearGradient>
			<LinearGradient
				colors={['transparent', '#080808']}
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
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
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
