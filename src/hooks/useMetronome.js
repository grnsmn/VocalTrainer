import { useRef, useCallback, useEffect } from 'react';
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { Platform } from 'react-native';

/**
 * Hook per la riproduzione precisa di click del metronomo.
 *
 * PROBLEMA RISOLTO:
 * expo-audio's seekTo() è asincrono. Se chiami seekTo(0) e poi play() senza
 * aspettare, a BPM alti il suono potrebbe non partire perché il seek non è finito.
 *
 * SOLUZIONE (Double-Buffering):
 * Creiamo 2 player per ogni suono e li alterniamo:
 * - Player A suona → poi fa seekTo(0) in background
 * - Player B suona (già pronto a 0) → poi fa seekTo(0) in background
 * - Player A è ora pronto → e così via...
 *
 * Così non dobbiamo mai aspettare seekTo() durante la riproduzione.
 */
export const useMetronome = () => {
	// ===== DOUBLE-BUFFERING: 2 player per ogni suono =====
	// Perché 2? Mentre uno suona e poi fa seek, l'altro è già pronto.
	const click1A = useAudioPlayer(
		require('../../assets/sounds/click1-v2.mp3'),
	);
	const click1B = useAudioPlayer(
		require('../../assets/sounds/click1-v2.mp3'),
	);
	const click2A = useAudioPlayer(
		require('../../assets/sounds/click2-v2.mp3'),
	);
	const click2B = useAudioPlayer(
		require('../../assets/sounds/click2-v2.mp3'),
	);

	// ===== INDICI PER ALTERNARE TRA A E B =====
	// useRef invece di useState perché:
	// - Non vogliamo re-render ad ogni click (sarebbe lentissimo a 180 BPM)
	// - Ci serve solo tenere traccia di quale player usare
	const click1Index = useRef(0);
	const click2Index = useRef(0);

	// ===== CONFIGURAZIONE AUDIO =====
	// Chiamata una volta al mount per configurare la modalità audio
	// Solo su native (Android/iOS) - su web non è necessario
	useEffect(() => {
		const setupAudio = async () => {
			// setAudioModeAsync non è disponibile su web
			if (Platform.OS === 'web') return;

			try {
				await setAudioModeAsync({
					// playsInSilentMode: true = suona anche se il telefono è in silenzioso
					playsInSilentMode: true,
					// shouldDuckAndroid: false = non abbassa il volume di altre app
					shouldDuckAndroid: false,
				});
			} catch (error) {
				console.warn('Failed to set audio mode:', error);
			}
		};
		setupAudio();
	}, []);

	// ===== FUNZIONE PLAY CLICK 1 (beat normale) =====
	const playClick1 = useCallback(() => {
		// Array dei 2 player per click1
		const players = [click1A, click1B];
		// Prendi il player corrente (0 o 1)
		const currentPlayer = players[click1Index.current];

		if (currentPlayer) {
			// 1. PLAY IMMEDIATO - il player è già a posizione 0
			currentPlayer.play();

			// 2. SEEK ASINCRONO - prepara per il prossimo uso
			// Non aspettiamo! Lo facciamo in background.
			// Quando questo player verrà riusato (tra 2 tick), sarà già pronto.
			currentPlayer.seekTo(0);

			// 3. ALTERNA - prossimo click userà l'altro player
			click1Index.current = (click1Index.current + 1) % 2;
		}
	}, [click1A, click1B]);

	// ===== FUNZIONE PLAY CLICK 2 (ultimo beat del ciclo) =====
	const playClick2 = useCallback(() => {
		const players = [click2A, click2B];
		const currentPlayer = players[click2Index.current];

		if (currentPlayer) {
			currentPlayer.play();
			currentPlayer.seekTo(0);
			click2Index.current = (click2Index.current + 1) % 2;
		}
	}, [click2A, click2B]);

	return { playClick1, playClick2 };
};
