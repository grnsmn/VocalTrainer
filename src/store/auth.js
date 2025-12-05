import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useAuthStore = create(
	devtools(
		set => ({
			auth: undefined,
			setAuth: user => set(() => ({ auth: user })),
			clearAuth: () => set(() => ({ auth: null })),
		}),
		{ name: 'AuthStore' },
	),
);
