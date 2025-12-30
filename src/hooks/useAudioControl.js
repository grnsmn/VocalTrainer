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

	// Ottieni lo status del player per avere isLoaded e isBuffering
	const status = useAudioPlayerStatus(player);

	// Refs per avere sempre i valori aggiornati nelle callbacks
	const playerRef = useRef(player);
	const soundChooseRef = useRef(soundChoose);
	const shouldPlayRef = useRef(false);

	useEffect(() => {
		playerRef.current = player;

		// Quando il player cambia e deve riprodurre, fai play
		if (player && shouldPlayRef.current && source) {
			try {
				player.play();
				shouldPlayRef.current = false;
			} catch (e) {
				console.log('Error auto-playing:', e);
			}
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
		} catch (e) {
			console.log('Player already released');
		}
		shouldPlayRef.current = false;
		setIsPlaying(false);
		setSoundChoose('');
		setSource(null);
	}, []);

	const handlePlayPause = useCallback(async path => {
		// Se tap sullo stesso audio che sta suonando, ferma
		if (soundChooseRef.current === path) {
			stopSound();
			return;
		}

		// Pausa il player corrente (se sta suonando)
		try {
			if (playerRef.current?.playing) {
				playerRef.current.pause();
			}
		} catch (e) {
			// Player già rilasciato, ignora
		}

		// Imposta immediatamente il nuovo audio selezionato
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
			console.error('Error getting download URL:', error);
			setIsPlaying(false);
			setSoundChoose('');
			shouldPlayRef.current = false;
			setIsLoadingUrl(false);
		}
	}, [storage, stopSound]);

	// isLoading è true se stiamo caricando l'URL o se il player sta bufferando
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

