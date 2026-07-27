import React, { useCallback } from 'react';
import { Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MidiProvider, PianoKeyboard, useMidi } from 'react-native-piano-keyboard';
import KeyboardControlsPanel from './components/KeyboardControlsPanel';
import { END_KEY, START_KEY } from './keyboard.constants';
import { useKeyboardScalePlayback } from './hooks/useKeyboardScalePlayback';

// Render keyboard screen content inside MidiProvider context.
const KeyboardContent = () => {
	const { height } = useWindowDimensions();
	const { triggerAttackRelease } = useMidi();
	const {
		selectedKey,
		selectedScaleType,
		startOctave,
		bpm,
		isPlaying,
		playedSteps,
		activePlaybackNote,
		currentSequence,
		setSelectedKey,
		setSelectedScaleType,
		setStartOctave,
		setBpm,
		startPlayback,
		stopPlayback,
	} = useKeyboardScalePlayback(triggerAttackRelease);

	// Keep callback explicit for future note-tracking features.
	const handleKeyPress = useCallback(note => {
		void note;
	}, []);

	return (
		<>
			<LinearGradient colors={['#CCE9FF', 'transparent']} style={styles.controlsArea}>
				<KeyboardControlsPanel
					selectedKey={selectedKey}
					selectedScaleType={selectedScaleType}
					startOctave={startOctave}
					bpm={bpm}
					isPlaying={isPlaying}
					playedSteps={playedSteps}
					sequenceLength={currentSequence.length}
					onSelectKey={setSelectedKey}
					onSelectScaleType={setSelectedScaleType}
					onSelectStartOctave={setStartOctave}
					onPlay={startPlayback}
					onStop={stopPlayback}
					onChangeBpm={setBpm}
				/>
			</LinearGradient>
			<LinearGradient
				colors={['transparent', '#080808']}
				style={[styles.keyboard, Platform.OS !== 'web' && { height: Math.min(height * 0.45, 260) }]}
			>
				<PianoKeyboard
					startKey={START_KEY}
					endKey={END_KEY}
					onPressKey={handleKeyPress}
					activeKeys={activePlaybackNote ? [activePlaybackNote] : []}
				/>
			</LinearGradient>
		</>
	);
};

const KeyboardScreen = () => {
	return (
		<MidiProvider>
			<KeyboardContent />
		</MidiProvider>
	);
};

const styles = StyleSheet.create({
	controlsArea: {
		flex: 1,
	},
	keyboard: {
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		overflow: 'hidden',
	},
});

export default KeyboardScreen;
