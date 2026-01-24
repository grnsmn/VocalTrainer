import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStore = create(
	devtools(
		persist(
			set => ({
				auth: undefined,
				sounds: {
					click1: undefined,
					click2: undefined,
				},
				setSounds: newSounds => set(() => ({ sounds: newSounds })),
				setAuth: newAuth => set(() => ({ auth: newAuth })),
				clearAuth: () => set(() => ({ auth: undefined })),
			}),
			{
				name: 'vocaltrainer-storage',
				storage: createJSONStorage(() => AsyncStorage),
				partialize: state => ({ auth: state.auth }), // Only persist auth, not sounds
			},
		),
		{ name: 'AuthStore' },
	),
);

export default useStore;
