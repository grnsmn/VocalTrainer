import { useState, useCallback, useRef, useEffect } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { ref, getDownloadURL } from 'firebase/storage';
import { STORAGE_PATH } from '@env';

export const useAudioControl = storage => {
	// State
	const [selectedSound, setSelectedSound] = useState('');
	const [source, setSource] = useState(null);
	const [isLoadingUrl, setIsLoadingUrl] = useState(false);

	// Audio player
	const player = useAudioPlayer(source);
	const status = useAudioPlayerStatus(player);

	// Refs to avoid stale closures in callbacks
	const playerRef = useRef(player);
	const selectedSoundRef = useRef(selectedSound);
	const shouldAutoPlay = useRef(false);

	// Sync refs with state
	useEffect(() => {
		playerRef.current = player;
	}, [player]);

	useEffect(() => {
		selectedSoundRef.current = selectedSound;
	}, [selectedSound]);

	// Auto-play when player is ready
	useEffect(() => {
		if (!player || !source || !shouldAutoPlay.current) return;

		try {
			player.play();
			shouldAutoPlay.current = false;
		} catch { }
	}, [player, source]);

	// Helper: safely pause current player
	const pausePlayer = useCallback(() => {
		try {
			if (playerRef.current?.playing) {
				playerRef.current.pause();
			}
		} catch { }
	}, []);

	// Helper: reset all state
	const resetState = useCallback(() => {
		shouldAutoPlay.current = false;
		setSelectedSound('');
		setSource(null);
		setIsLoadingUrl(false);
	}, []);

	// Helper: fetch audio URL from Firebase
	const fetchAudioUrl = useCallback(async path => {
		const soundRef = ref(storage, `${STORAGE_PATH}/${path}`);
		return getDownloadURL(soundRef);
	}, [storage]);

	const stopSound = useCallback(() => {
		pausePlayer();
		resetState();
	}, [pausePlayer, resetState]);

	const handlePlayPause = useCallback(async path => {
		// Toggle off if tapping the same audio
		if (selectedSoundRef.current === path) {
			stopSound();
			return;
		}

		// Pause current audio before switching
		pausePlayer();

		// Set new audio state
		setSelectedSound(path);
		setIsLoadingUrl(true);
		shouldAutoPlay.current = true;

		try {
			const uri = await fetchAudioUrl(path);
			setSource(uri);
		} catch {
			resetState();
		} finally {
			setIsLoadingUrl(false);
		}
	}, [pausePlayer, fetchAudioUrl, stopSound, resetState]);

	// Computed values
	const isLoading = isLoadingUrl || (status?.isBuffering && !status?.isLoaded);
	const isPlaying = Boolean(selectedSound && status?.playing);

	return {
		selectedSound,
		isPlaying,
		isLoading,
		handlePlayPause,
		stopSound,
	};
};
