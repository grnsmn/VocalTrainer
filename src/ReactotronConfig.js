import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import reactotronZustand from 'reactotron-plugin-zustand';
import { Platform } from 'react-native';

// Creiamo una funzione per configurare Reactotron con lo store
// per evitare importazioni circolari
let zustandStores = [];

export const addZustandStore = (name, store) => {
	zustandStores.push({ name, store });
};

if (__DEV__) {
	Reactotron.setAsyncStorageHandler(AsyncStorage) // Integrazione con AsyncStorage
		.configure({
			name: 'VocalTrainer',
			// Se stiamo usando un dispositivo fisico, utilizziamo l'indirizzo IP del computer
			// Per Expo, è necessario impostare manualmente l'IP del tuo computer
			host: Platform.OS === 'ios' ? 'localhost' : '192.168.1.25',
			port: 9090,
		})
		.useReactNative({
			asyncStorage: false, // Lo abbiamo già configurato sopra
			networking: {
				// Ignora il corpo delle richieste per prevenire crash con file di grandi dimensioni
				ignoreUrls: /symbolicate/,
			},
			editor: false, // Apre il tuo editor
			errors: { veto: stackFrame => false }, // o true per ignorare alcuni errori
			overlay: false, // Disabilita l'overlay
		})
		.connect();

	// Aggiungiamo funzioni di logging personalizzate
	Reactotron.clear();
	console.tron = Reactotron;

	// Sovrascriviamo console.log, console.warn, console.error per reindirizzarli anche a Reactotron
	const oldLog = console.log;
	console.log = (...args) => {
		oldLog(...args);
		Reactotron.log(...args);
	};

	const oldWarn = console.warn;
	console.warn = (...args) => {
		oldWarn(...args);
		Reactotron.warn(args);
	};

	const oldError = console.error;
	console.error = (...args) => {
		oldError(...args);
		Reactotron.error(args);
	};

	// Messaggio di benvenuto
	Reactotron.log('Reactotron Configurato 🚀');
}

// Funzione per configurare il plugin Zustand dopo che lo store è stato creato
export const setupZustandPlugin = () => {
	if (__DEV__ && zustandStores.length > 0) {
		Reactotron.use(
			reactotronZustand({
				stores: zustandStores,
				omitFunctionKeys: true,
			}),
		);
	}
};

export default Reactotron;
