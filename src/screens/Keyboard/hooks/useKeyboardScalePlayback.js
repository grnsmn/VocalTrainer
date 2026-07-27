import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import {
	DEFAULT_BPM,
	DEFAULT_SCALE_TYPE,
	DEFAULT_START_OCTAVE,
	DEFAULT_SELECTED_KEY,
} from '../keyboard.constants';

import { keyboardPlaybackReducer, initialState, ACTION } from './playbackReducer';
import { buildScaleSequence } from './playbackUtils';
import { usePlaybackLoop } from './usePlaybackLoop';

/**
 * Manage scale playback and expose UI-ready state/actions.
 * This hook is refactored to use useReducer and internal helper hooks/utils.
 */
export const useKeyboardScalePlayback = (triggerAttackRelease) => {
	const [state, dispatch] = useReducer(keyboardPlaybackReducer, initialState);
	const {
		selectedKey,
		selectedScaleType,
		startOctave,
		bpm,
		isPlaying,
		playedSteps,
		activePlaybackNote,
	} = state;

	const { startPlayback: loopStartPlayback, stopPlayback, setBpm } = usePlaybackLoop(
		triggerAttackRelease,
		dispatch,
		ACTION,
	);

	// Track previous selection to trigger autoplay only on real changes.
	const previousSelectionRef = useRef({
		selectedKey,
		selectedScaleType,
		startOctave,
		isInitialized: false,
	});

	const currentSequence = useMemo(
		() => buildScaleSequence(selectedKey, selectedScaleType, startOctave),
		[selectedKey, selectedScaleType, startOctave]
	);

	// Keep the playback loop in sync with BPM changes.
	useEffect(() => {
		setBpm(bpm);
	}, [bpm, setBpm]);

	const startPlayback = useCallback(() => {
		loopStartPlayback(currentSequence);
	}, [currentSequence, loopStartPlayback]);

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

		if (hasSelectionChanged) {
			startPlayback();
		}
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
