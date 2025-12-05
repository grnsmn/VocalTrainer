import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useSoundStore = create(
	devtools(
		set => ({
			click1: undefined,
			click2: undefined,
			setSounds: ({ click1, click2 }) => set(() => ({ click1, click2 })),
		}),
		{ name: 'SoundStore' },
	),
);
