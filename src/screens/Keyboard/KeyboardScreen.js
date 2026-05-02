import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Note, Scale } from 'tonal';
import {
	MidiProvider,
	PianoKeyboard,
	useMidi,
} from 'react-native-piano-keyboard';
import AnimatedVoiceLines from '../../../assets/lotties/voice_lines.json';
import AnimatedSpeaker from '../../../assets/lotties/speaker_playing.json';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
	Slider,
	SliderFilledTrack,
	SliderThumb,
	SliderTrack,
} from '@/components/ui/slider';

const START_KEY = 'C2';
const END_KEY = 'C5';
const NOTE_STEP_MS = bpm => Math.round(60000 / bpm);

const SCALE_TYPES = [
	{
		id: 'majorPentatonic',
		label: 'Major Pentatonic',
		tonalName: 'pentatonic',
	},
	{
		id: 'minorPentatonic',
		label: 'Minor Pentatonic',
		tonalName: 'minor pentatonic',
	},
];

const KEY_OPTIONS = [
	'C',
	'C#',
	'D',
	'D#',
	'E',
	'F',
	'F#',
	'G',
	'G#',
	'A',
	'A#',
	'B',
];

const normalizeNote = note =>
	Note.simplify(note)
		.replace('Db', 'C#')
		.replace('Eb', 'D#')
		.replace('Gb', 'F#')
		.replace('Ab', 'G#')
		.replace('Bb', 'A#');

// Build the playable sequence (up + down) in the keyboard range.
const buildScaleSequence = (selectedKey, selectedScaleType) => {
	const scaleType = SCALE_TYPES.find(type => type.id === selectedScaleType);

	if (!scaleType) {
		return [];
	}

	const notes = Scale.get(`${selectedKey} ${scaleType.tonalName}`).notes;

	if (!notes.length) {
		return [];
	}

	// Keep an always-ascending melody by rolling notes to the next octave when needed.
	const ascending = [];
	let previousMidi = null;

	notes.forEach(noteName => {
		let octave = 2;
		let candidateNote = normalizeNote(`${noteName}${octave}`);
		let candidateMidi = Note.midi(candidateNote);

		while (previousMidi !== null && candidateMidi <= previousMidi) {
			octave += 1;
			candidateNote = normalizeNote(`${noteName}${octave}`);
			candidateMidi = Note.midi(candidateNote);
		}

		ascending.push(candidateNote);
		previousMidi = candidateMidi;
	});

	let topOctave = 3;
	let topNote = normalizeNote(`${selectedKey}${topOctave}`);
	let topNoteMidi = Note.midi(topNote);

	while (topNoteMidi <= previousMidi) {
		topOctave += 1;
		topNote = normalizeNote(`${selectedKey}${topOctave}`);
		topNoteMidi = Note.midi(topNote);
	}

	const fullAscending = [...ascending, topNote];
	const descending = [...fullAscending].slice(0, -1).reverse();

	return [...fullAscending, ...descending];
};

// Render one horizontal list of selectable chips.
const SelectionRow = ({ items, selectedItem, onSelect, style }) => (
	<View style={[styles.row, style]}>
		{items.map(item => {
			const itemId = typeof item === 'string' ? item : item.id;
			const itemLabel = typeof item === 'string' ? item : item.label;
			const isActive = selectedItem === itemId;

			return (
				<Pressable
					key={itemId}
					onPress={() => onSelect(itemId)}
					style={[styles.chip, isActive && styles.chipActive]}
				>
					<Text
						style={[
							styles.chipText,
							isActive && styles.chipTextActive,
						]}
					>
						{itemLabel}
					</Text>
				</Pressable>
			);
		})}
	</View>
);

// Encapsulate playback logic and keyboard controls under MidiProvider.
const KeyboardContent = () => {
	const { triggerAttackRelease } = useMidi();
	const [selectedKey, setSelectedKey] = useState('C');
	const [selectedScaleType, setSelectedScaleType] =
		useState('majorPentatonic');
	const [bpm, setBpm] = useState(100);
	const [isPlaying, setIsPlaying] = useState(false);
	const [playedSteps, setPlayedSteps] = useState(0);
	const [activePlaybackNote, setActivePlaybackNote] = useState(null);
	const timeoutRef = useRef(null);
	const isPlayingRef = useRef(false);
	const bpmRef = useRef(bpm);
	const isFirstSelectionRenderRef = useRef(true);
	const onPressKey = useCallback(note => {
		// Keep callback explicit for future note-tracking features.
		void note;
	}, []);

	const currentSequence = useMemo(
		() => buildScaleSequence(selectedKey, selectedScaleType),
		[selectedKey, selectedScaleType],
	);

	// Always use the freshest BPM value inside timers.
	useEffect(() => {
		bpmRef.current = bpm;
	}, [bpm]);

	// Stop playback and cleanup pending timers.
	const stopPlayback = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}

		isPlayingRef.current = false;
		setIsPlaying(false);
		setPlayedSteps(0);
		setActivePlaybackNote(null);
	}, []);

	// Start automatic playback for the currently selected scale.
	const startPlayback = useCallback(
		(sequence = currentSequence) => {
			if (!sequence.length) {
				stopPlayback();
				return;
			}

			stopPlayback();
			isPlayingRef.current = true;
			setIsPlaying(true);

			let stepIndex = 0;
			let retryCount = 0;
			const MAX_RETRY_PER_STEP = 25;
			const playNext = () => {
				if (!isPlayingRef.current) {
					return;
				}

				const note = sequence[stepIndex];
				const stepMs = NOTE_STEP_MS(bpmRef.current);
				const durationSeconds = Math.max((stepMs * 0.75) / 1000, 0.08);

				try {
					triggerAttackRelease(note, `${durationSeconds}`);
					setActivePlaybackNote(note);
					retryCount = 0;
				} catch (error) {
					const errorMessage = String(error?.message || error);
					const isBufferNotLoadedError = errorMessage.includes(
						'buffer is either not set or not loaded',
					);

					if (
						isBufferNotLoadedError &&
						retryCount < MAX_RETRY_PER_STEP
					) {
						retryCount += 1;
						timeoutRef.current = setTimeout(playNext, 120);
						return;
					}

					stopPlayback();
					return;
				}

				setPlayedSteps(stepIndex + 1);
				stepIndex += 1;

				if (stepIndex >= sequence.length) {
					stopPlayback();
					return;
				}

				timeoutRef.current = setTimeout(playNext, stepMs);
			};

			playNext();
		},
		[currentSequence, stopPlayback, triggerAttackRelease],
	);

	// Auto-start sequence after key/scale selection changes (excluding first render).
	useEffect(() => {
		if (isFirstSelectionRenderRef.current) {
			isFirstSelectionRenderRef.current = false;
			return;
		}

		startPlayback();
	}, [selectedKey, selectedScaleType, startPlayback]);

	useEffect(() => () => stopPlayback(), [stopPlayback]);

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
					loop
					style={styles.smallSpeaker}
				/>
				<View style={styles.controlsContainer}>
					<LottieView
						webStyle={{ width: 400, height: 300 }}
						source={AnimatedVoiceLines}
						autoPlay
						loop
						style={styles.voiceLines}
					/>
					<SelectionRow
						items={KEY_OPTIONS}
						selectedItem={selectedKey}
						onSelect={setSelectedKey}
					/>
					<SelectionRow
						items={SCALE_TYPES}
						selectedItem={selectedScaleType}
						onSelect={setSelectedScaleType}
						style={styles.scaleRow}
					/>
					<View style={styles.actionsRow}>
						<Pressable
							onPress={() => startPlayback()}
							style={[styles.actionButton, styles.playButton]}
						>
							<Text style={styles.actionButtonText}>Play</Text>
						</Pressable>
						<Pressable
							onPress={stopPlayback}
							style={[styles.actionButton, styles.stopButton]}
						>
							<Text style={styles.actionButtonText}>Stop</Text>
						</Pressable>
					</View>
					<Text style={styles.statusText}>
						{`${bpm} BPM - ${isPlaying ? `Playing ${playedSteps}/${currentSequence.length}` : 'Idle'}`}
					</Text>
					<View style={styles.sliderContainer}>
						<Slider
							defaultValue={100}
							value={bpm}
							size="sm"
							minValue={50}
							maxValue={180}
							orientation="horizontal"
							onChange={setBpm}
						>
							<SliderTrack>
								<SliderFilledTrack />
							</SliderTrack>
							<SliderThumb />
						</Slider>
					</View>
				</View>
				<LottieView
					webStyle={{ width: 200, height: 200 }}
					source={AnimatedSpeaker}
					autoPlay
					loop
					style={styles.smallSpeaker}
				/>
			</LinearGradient>
			<LinearGradient
				colors={['transparent', '#080808']}
				style={styles.keyboard}
			>
				<PianoKeyboard
					startKey={START_KEY}
					endKey={END_KEY}
					onPressKey={onPressKey}
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
	container: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	controlsContainer: {
		flex: 1,
		alignItems: 'center',
		paddingHorizontal: 10,
	},
	row: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
		justifyContent: 'center',
	},
	scaleRow: {
		marginTop: 8,
	},
	chip: {
		paddingVertical: 6,
		paddingHorizontal: 10,
		backgroundColor: '#E9F4FF',
		borderRadius: 999,
	},
	chipActive: {
		backgroundColor: '#005DB4',
	},
	chipText: {
		color: '#005DB4',
		fontSize: 12,
		fontWeight: '600',
	},
	chipTextActive: {
		color: '#FFFFFF',
	},
	actionsRow: {
		flexDirection: 'row',
		gap: 10,
		marginTop: 10,
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
		marginTop: 10,
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
	keyboard: {
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		overflow: 'hidden',
	},
});

export default KeyboardScreen;
