import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useStore = create(
	devtools(
		set => ({
			auth: undefined,
			setAuth: newAuth => set(() => ({ auth: newAuth })),
			clearAuth: () => set(() => ({ auth: undefined })),
			clearAll: () => set(() => ({ auth: undefined })),
		}),
		{ name: 'AuthStore' },
	),
);

export default useStore;
