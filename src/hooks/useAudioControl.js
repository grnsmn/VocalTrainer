import { useState, useCallback, useRef, useEffect } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { ref, getDownloadURL } from 'firebase/storage';
import { STORAGE_PATH } from '@env';

export const useAudioControl = storage => {
	const [soundChoose, setSoundChoose] = useState('');
	const [source, setSource] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLoadingUrl, setIsLoadingUrl] = useState(false);
	const player = useAudioPlayer(source);
	const status = useAudioPlayerStatus(player);

	// Refs to always have updated values in callbacks (avoid stale closures)
	const playerRef = useRef(player);
	const soundChooseRef = useRef(soundChoose);
	const shouldPlayRef = useRef(false);

	// Auto-play when player is ready and shouldPlayRef is true
	useEffect(() => {
		playerRef.current = player;

		if (player && shouldPlayRef.current && source) {
			try {
				player.play();
				shouldPlayRef.current = false;
			} catch (e) { }
		}
	}, [player, source]);

	useEffect(() => {
		soundChooseRef.current = soundChoose;
	}, [soundChoose]);

	const stopSound = useCallback(() => {
		try {
			if (playerRef.current?.playing) {
				playerRef.current.pause();
			}
		} catch (e) { }
		shouldPlayRef.current = false;
		setIsPlaying(false);
		setSoundChoose('');
		setSource(null);
	}, []);

	const handlePlayPause = useCallback(async path => {
		// Toggle off if tapping the same audio
		if (soundChooseRef.current === path) {
			stopSound();
			return;
		}

		// Pause current audio before switching
		try {
			if (playerRef.current?.playing) {
				playerRef.current.pause();
			}
		} catch (e) { }

		setSoundChoose(path);
		setIsPlaying(true);
		setIsLoadingUrl(true);
		shouldPlayRef.current = true;

		try {
			const soundRef = ref(storage, `${STORAGE_PATH}/${path}`);
			const uri = await getDownloadURL(soundRef);
			setSource(uri);
			setIsLoadingUrl(false);
		} catch (error) {
			setIsPlaying(false);
			setSoundChoose('');
			shouldPlayRef.current = false;
			setIsLoadingUrl(false);
		}
	}, [storage, stopSound]);

	const isLoading = isLoadingUrl || (status?.isBuffering && !status?.isLoaded);

	return {
		player,
		soundChoose,
		handlePlayPause,
		stopSound,
		source,
		isPlaying,
		isLoading,
		status,
	};
};

