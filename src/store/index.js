import { create } from 'zustand';

const useStore = create(set => ({
	auth: {
		user: null,
		accessToken: '',
	},
	setAuth: newAuth => set(() => ({ auth: newAuth })),
	setAccessToken: newAccessToken =>
		set(state => ({
			auth: {
				...state.auth,
				accessToken: newAccessToken,
			},
		})),
}));

export default useStore;
