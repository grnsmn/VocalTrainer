import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { addZustandStore } from '../ReactotronConfig';

// Creazione dello store utilizzando devtools
const useStore = create(
	devtools(
		set => ({
			auth: undefined,
			setAuth: newAuth => set(() => ({ auth: newAuth })),
			clearAuth: () => set(() => ({ auth: undefined })),
		}),
		{ name: 'AuthStore' },
	),
);

// Registra lo store in Reactotron se in development
if (__DEV__) {
	addZustandStore('auth', useStore);
}

export default useStore;
