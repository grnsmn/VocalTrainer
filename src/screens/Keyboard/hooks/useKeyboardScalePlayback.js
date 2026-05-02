import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Note, Scale } from 'tonal';
import {
	DEFAULT_BPM,
	DEFAULT_SCALE_TYPE,
	DEFAULT_SELECTED_KEY,
	SCALE_TYPES,
} from '../keyboard.constants';

const NOTE_STEP_MS = bpm => Math.round(60000 / bpm);
const MAX_RETRY_PER_STEP = 25;

// Normalize enharmonic note names for keyboard matching.
const normalizeNote = note =>
	Note.simplify(note)
		.replace('Db', 'C#')
		.replace('Eb', 'D#')
		.replace('Gb', 'F#')
		.replace('Ab', 'G#')
		.replace('Bb', 'A#');

// Build an ascending+descending pentatonic sequence with octave rollover.
const buildScaleSequence = (selectedKey, selectedScaleType) => {
	const scaleType = SCALE_TYPES.find(type => type.id === selectedScaleType);

	if (!scaleType) {
		return [];
	}

	const notes = Scale.get(`${selectedKey} ${scaleType.tonalName}`).notes;

	if (!notes.length) {
		return [];
	}

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

// Manage scale playback and expose UI-ready state/actions.
export const useKeyboardScalePlayback = triggerAttackRelease => {
	const [selectedKey, setSelectedKey] = useState(DEFAULT_SELECTED_KEY);
	const [selectedScaleType, setSelectedScaleType] =
		useState(DEFAULT_SCALE_TYPE);
	const [bpm, setBpm] = useState(DEFAULT_BPM);
	const [isPlaying, setIsPlaying] = useState(false);
	const [playedSteps, setPlayedSteps] = useState(0);
	const [activePlaybackNote, setActivePlaybackNote] = useState(null);
	const timeoutRef = useRef(null);
	const clearActiveNoteTimeoutRef = useRef(null);
	const isPlayingRef = useRef(false);
	const bpmRef = useRef(bpm);
	const previousSelectionRef = useRef({
		selectedKey: DEFAULT_SELECTED_KEY,
		selectedScaleType: DEFAULT_SCALE_TYPE,
		isInitialized: false,
	});

	const currentSequence = useMemo(
		() => buildScaleSequence(selectedKey, selectedScaleType),
		[selectedKey, selectedScaleType],
	);

	// Keep the latest bpm value available inside timer callbacks.
	useEffect(() => {
		bpmRef.current = bpm;
	}, [bpm]);

	// Stop playback and cleanup all pending timers.
	const stopPlayback = useCallback((clearActiveNote = true) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}

		if (clearActiveNote && clearActiveNoteTimeoutRef.current) {
			clearTimeout(clearActiveNoteTimeoutRef.current);
			clearActiveNoteTimeoutRef.current = null;
		}

		isPlayingRef.current = false;
		setIsPlaying(false);
		setPlayedSteps(0);

		if (clearActiveNote) {
			setActivePlaybackNote(null);
		}
	}, []);

	// Start playback for the current sequence and handle retries while buffers load.
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

					if (isBufferNotLoadedError && retryCount < MAX_RETRY_PER_STEP) {
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
					clearActiveNoteTimeoutRef.current = setTimeout(() => {
						setActivePlaybackNote(null);
						clearActiveNoteTimeoutRef.current = null;
					}, Math.max(stepMs * 0.55, 120));
					stopPlayback(false);
					return;
				}

				timeoutRef.current = setTimeout(playNext, stepMs);
			};

			playNext();
		},
		[currentSequence, stopPlayback, triggerAttackRelease],
	);

	// Auto-play only after a real key/scale selection change (never on first mount).
	useEffect(() => {
		if (!previousSelectionRef.current.isInitialized) {
			previousSelectionRef.current = {
				selectedKey,
				selectedScaleType,
				isInitialized: true,
			};
			return;
		}

		const hasSelectionChanged =
			previousSelectionRef.current.selectedKey !== selectedKey ||
			previousSelectionRef.current.selectedScaleType !== selectedScaleType;

		previousSelectionRef.current = {
			selectedKey,
			selectedScaleType,
			isInitialized: true,
		};

		if (!hasSelectionChanged) {
			return;
		}

		startPlayback();
	}, [selectedKey, selectedScaleType, startPlayback]);

	// Cleanup timers when unmounting.
	useEffect(() => () => stopPlayback(), [stopPlayback]);

	return {
		selectedKey,
		selectedScaleType,
		bpm,
		isPlaying,
		playedSteps,
		activePlaybackNote,
		currentSequence,
		setSelectedKey,
		setSelectedScaleType,
		setBpm,
		startPlayback,
		stopPlayback,
	};
};
