import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useStore = create(
	devtools(
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
		{ name: 'AuthStore' },
	),
);

export default useStore;
