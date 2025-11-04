import { useState } from 'react';
import { useAudioPlayer } from 'expo-audio';
import { ref, getDownloadURL } from 'firebase/storage';
import { STORAGE_PATH } from '@env';

export const useAudioControl = storage => {
	const [soundChoose, setSoundChoose] = useState('');
	const [source, setSource] = useState(null);
	const player = useAudioPlayer(source);

	const handlePlayPause = async path => {
		if (player.playing && soundChoose === path) {
			stopSound();
			return;
		}

		if (player.playing) {
			player.pause();
		}

		setSoundChoose(path);

		try {
			const soundRef = ref(storage, `${STORAGE_PATH}/${path}`);
			const uri = await getDownloadURL(soundRef);
			setSource(uri);
		} catch (error) {
			console.error('Error getting download URL:', error);
		}
	};

	const stopSound = () => {
		if (player.playing) {
			player.pause();
			setSource(null);
			setSoundChoose('');
		}
	};

	return {
		player,
		soundChoose,
		handlePlayPause,
		stopSound,
		source,
	};
};
