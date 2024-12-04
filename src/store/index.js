import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useStore = create(
	devtools(
		set => ({
			auth: undefined,
			setAuth: newAuth => set(() => ({ auth: newAuth })),
		}),
		{ name: 'AuthStore' },
	),
);

export default useStore;
