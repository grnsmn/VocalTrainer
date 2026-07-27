import { useCallback, useRef } from 'react';
import { NOTE_STEP_MS, MAX_RETRY_PER_STEP } from './playbackUtils';

/**
 * Manages the timer-based loop for playing a sequence of notes.
 */
export const usePlaybackLoop = (triggerAttackRelease, dispatch, ACTION) => {
	const timeoutRef = useRef(null);
	const clearActiveNoteTimeoutRef = useRef(null);
	const isPlayingRef = useRef(false);
	const bpmRef = useRef(100);

	const setBpm = useCallback(bpm => {
		bpmRef.current = bpm;
	}, []);

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
	}, [dispatch, ACTION]);

	const startPlayback = useCallback((sequence) => {
		if (!sequence || !sequence.length) {
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
	}, [dispatch, ACTION, stopPlayback, triggerAttackRelease]);

	return {
		startPlayback,
		stopPlayback,
		setBpm,
	};
};
