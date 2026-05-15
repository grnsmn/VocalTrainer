import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import LottieView from 'lottie-react-native';
import {
	Slider,
	SliderFilledTrack,
	SliderThumb,
	SliderTrack,
} from '@/components/ui/slider';
import AnimatedVoiceLines from '../../../../assets/lotties/voice_lines.json';
import AnimatedSpeaker from '../../../../assets/lotties/speaker_playing.json';
import {
	KEY_OPTIONS,
	SCALE_TYPES,
	START_OCTAVE_OPTIONS,
} from '../keyboard.constants';
import SelectionRow from './SelectionRow';

// Render the whole control surface above the keyboard.
const KeyboardControlsPanel = ({
	selectedKey,
	selectedScaleType,
	startOctave,
	bpm,
	isPlaying,
	playedSteps,
	sequenceLength,
	onSelectKey,
	onSelectScaleType,
	onSelectStartOctave,
	onPlay,
	onStop,
	onChangeBpm,
}) => {
	const isMobile = Platform.OS !== 'web';

	return (
		<View style={styles.container}>
			{!isMobile && (
				<LottieView
					webStyle={{ width: 200, height: 200 }}
					source={AnimatedSpeaker}
					autoPlay
					loop
					style={styles.smallSpeaker}
				/>
			)}
			<ScrollView
				style={styles.scrollArea}
				contentContainerStyle={styles.controlsContainer}
				showsVerticalScrollIndicator={false}
			>
				<SelectionRow
					items={KEY_OPTIONS}
					selectedItem={selectedKey}
					onSelect={onSelectKey}
				/>
				<SelectionRow
					items={SCALE_TYPES}
					selectedItem={selectedScaleType}
					onSelect={onSelectScaleType}
					style={styles.scaleRow}
				/>
				<SelectionRow
					items={START_OCTAVE_OPTIONS}
					selectedItem={startOctave}
					onSelect={onSelectStartOctave}
					style={styles.scaleRow}
				/>
				<View style={styles.actionsRow}>
					<Pressable
						onPress={() => onPlay()}
						style={[styles.actionButton, styles.playButton]}
					>
						<Text style={styles.actionButtonText}>Play</Text>
					</Pressable>
					<Pressable
						onPress={() => onStop()}
						style={[styles.actionButton, styles.stopButton]}
					>
						<Text style={styles.actionButtonText}>Stop</Text>
					</Pressable>
				</View>
				<Text style={styles.statusText}>
					{`${bpm} BPM - ${isPlaying ? `Playing ${playedSteps}/${sequenceLength}` : 'Idle'}`}
				</Text>
				<View style={styles.sliderContainer}>
					<Slider
						defaultValue={100}
						value={bpm}
						size="sm"
						minValue={50}
						maxValue={180}
						orientation="horizontal"
						onChange={onChangeBpm}
					>
						<SliderTrack>
							<SliderFilledTrack />
						</SliderTrack>
						<SliderThumb />
					</Slider>
				</View>
			</ScrollView>
			{!isMobile && (
				<LottieView
					webStyle={{ width: 200, height: 200 }}
					source={AnimatedSpeaker}
					autoPlay
					loop
					style={styles.smallSpeaker}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	scrollArea: {
		flex: 1,
	},
	controlsContainer: {
		alignItems: 'center',
		paddingHorizontal: 10,
		paddingVertical: 8,
	},
	scaleRow: {
		marginTop: 6,
	},
	actionsRow: {
		flexDirection: 'row',
		gap: 10,
		marginTop: 8,
	},
	actionButton: {
		borderRadius: 10,
		paddingVertical: 8,
		paddingHorizontal: 14,
	},
	playButton: {
		backgroundColor: '#005DB4',
	},
	stopButton: {
		backgroundColor: '#1A1A1A',
	},
	actionButtonText: {
		color: '#FFFFFF',
		fontWeight: '700',
	},
	statusText: {
		marginTop: 6,
		color: '#005DB4',
		fontWeight: '700',
	},
	sliderContainer: {
		marginTop: 8,
		width: '85%',
		maxWidth: 320,
	},
	smallSpeaker: {
		width: 50,
		height: 50,
	},
	voiceLines: {
		width: 200,
		height: 120,
	},
});

export default KeyboardControlsPanel;
