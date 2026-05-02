import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { Note, Scale } from 'tonal';
import {
	DEFAULT_BPM,
	DEFAULT_SCALE_TYPE,
	DEFAULT_START_OCTAVE,
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
const buildScaleSequence = (selectedKey, selectedScaleType, startOctave) => {
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
		let octave = startOctave;
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

	let topOctave = startOctave + 1;
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

// --- Reducer ---

const initialState = {
	selectedKey: DEFAULT_SELECTED_KEY,
	selectedScaleType: DEFAULT_SCALE_TYPE,
	startOctave: DEFAULT_START_OCTAVE,
	bpm: DEFAULT_BPM,
	isPlaying: false,
	playedSteps: 0,
	activePlaybackNote: null,
};

const ACTION = {
	SET_KEY: 'SET_KEY',
	SET_SCALE_TYPE: 'SET_SCALE_TYPE',
	SET_START_OCTAVE: 'SET_START_OCTAVE',
	SET_BPM: 'SET_BPM',
	PLAY_STARTED: 'PLAY_STARTED',
	PLAY_STOPPED: 'PLAY_STOPPED',
	STEP_PLAYED: 'STEP_PLAYED',
	SET_ACTIVE_NOTE: 'SET_ACTIVE_NOTE',
	CLEAR_ACTIVE_NOTE: 'CLEAR_ACTIVE_NOTE',
};

const keyboardPlaybackReducer = (state, action) => {
	switch (action.type) {
		case ACTION.SET_KEY:
			return { ...state, selectedKey: action.payload };
		case ACTION.SET_SCALE_TYPE:
			return { ...state, selectedScaleType: action.payload };
		case ACTION.SET_START_OCTAVE:
			return { ...state, startOctave: action.payload };
		case ACTION.SET_BPM:
			return { ...state, bpm: action.payload };
		case ACTION.PLAY_STARTED:
			return { ...state, isPlaying: true, playedSteps: 0 };
		case ACTION.PLAY_STOPPED:
			return {
				...state,
				isPlaying: false,
				playedSteps: 0,
				...(action.payload?.clearActiveNote
					? { activePlaybackNote: null }
					: {}),
			};
		case ACTION.STEP_PLAYED:
			return { ...state, playedSteps: action.payload };
		case ACTION.SET_ACTIVE_NOTE:
			return { ...state, activePlaybackNote: action.payload };
		case ACTION.CLEAR_ACTIVE_NOTE:
			return { ...state, activePlaybackNote: null };
		default:
			return state;
	}
};

// Manage scale playback and expose UI-ready state/actions.
export const useKeyboardScalePlayback = triggerAttackRelease => {
	const [state, dispatch] = useReducer(keyboardPlaybackReducer, initialState);
	const { selectedKey, selectedScaleType, startOctave, bpm, isPlaying, playedSteps, activePlaybackNote } = state;

	const timeoutRef = useRef(null);
	const clearActiveNoteTimeoutRef = useRef(null);
	const isPlayingRef = useRef(false);
	const bpmRef = useRef(bpm);

	// Track previous selection to trigger autoplay only on real changes.
	const previousSelectionRef = useRef({
		selectedKey: DEFAULT_SELECTED_KEY,
		selectedScaleType: DEFAULT_SCALE_TYPE,
		startOctave: DEFAULT_START_OCTAVE,
		isInitialized: false,
	});

	const currentSequence = useMemo(
		() => buildScaleSequence(selectedKey, selectedScaleType, startOctave),
		[selectedKey, selectedScaleType, startOctave],
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
		dispatch({ type: ACTION.PLAY_STOPPED, payload: { clearActiveNote } });
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
			dispatch({ type: ACTION.PLAY_STARTED });

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
					dispatch({ type: ACTION.SET_ACTIVE_NOTE, payload: note });
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

				dispatch({ type: ACTION.STEP_PLAYED, payload: stepIndex + 1 });
				stepIndex += 1;

				if (stepIndex >= sequence.length) {
					clearActiveNoteTimeoutRef.current = setTimeout(() => {
						dispatch({ type: ACTION.CLEAR_ACTIVE_NOTE });
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
				startOctave,
				isInitialized: true,
			};
			return;
		}

		const hasSelectionChanged =
			previousSelectionRef.current.selectedKey !== selectedKey ||
			previousSelectionRef.current.selectedScaleType !== selectedScaleType ||
			previousSelectionRef.current.startOctave !== startOctave;

		previousSelectionRef.current = {
			selectedKey,
			selectedScaleType,
			startOctave,
			isInitialized: true,
		};

		if (!hasSelectionChanged) {
			return;
		}

		startPlayback();
	}, [selectedKey, selectedScaleType, startOctave, startPlayback]);

	// Cleanup timers when unmounting.
	useEffect(() => () => stopPlayback(), [stopPlayback]);

	return {
		selectedKey,
		selectedScaleType,
		startOctave,
		bpm,
		isPlaying,
		playedSteps,
		activePlaybackNote,
		currentSequence,
		setSelectedKey: payload => dispatch({ type: ACTION.SET_KEY, payload }),
		setSelectedScaleType: payload => dispatch({ type: ACTION.SET_SCALE_TYPE, payload }),
		setStartOctave: payload => dispatch({ type: ACTION.SET_START_OCTAVE, payload }),
		setBpm: payload => dispatch({ type: ACTION.SET_BPM, payload }),
		startPlayback,
		stopPlayback,
	};
};
