import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useStore = create(
	devtools(
		set => ({
			auth: undefined,
			setAuth: newAuth => set(() => ({ auth: newAuth })),
			setAccessToken: newAccessToken =>
				set(state => ({
					auth: {
						...state.auth,
						accessToken: newAccessToken,
					},
				})),
		}),
		{ name: 'AuthStore' },
	),
); // Nome per identificare lo store nei DevTools

export default useStore;
