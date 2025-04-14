import Reactotron from '../ReactotronConfig';

/**
 * Funzione di utility per il debug con Reactotron
 * @param {string} message - Il messaggio da loggare
 * @param {any} data - I dati da loggare
 * @param {string} [type='log'] - Il tipo di log ('log', 'warn', 'error', 'important')
 */
export const reactotronDebug = (message, data, type = 'log') => {
	if (__DEV__ && Reactotron) {
		switch (type) {
			case 'warn':
				Reactotron.warn(message, data);
				break;
			case 'error':
				Reactotron.error(message, data);
				break;
			case 'important':
				Reactotron.display({
					name: message,
					value: data,
					preview: message,
					important: true,
				});
				break;
			default:
				Reactotron.log(message, data);
		}
	}
};

/**
 * Traccia le performance di una funzione
 * @param {string} name - Il nome della funzione o dell'operazione da tracciare
 * @param {Function} fn - La funzione da eseguire
 * @returns {any} - Il risultato della funzione
 */
export const trackPerformance = (name, fn) => {
	if (__DEV__ && Reactotron) {
		const startTime = Date.now();
		const result = fn();
		const endTime = Date.now();
		Reactotron.display({
			name: `⏱️ Performance: ${name}`,
			value: endTime - startTime,
			preview: `${endTime - startTime}ms`,
		});
		return result;
	}
	return fn();
};

/**
 * Monitoraggio dello stato dell'applicazione
 * @param {string} stateName - Il nome dello stato da monitorare
 * @param {any} value - Il valore corrente dello stato
 */
export const monitorState = (stateName, value) => {
	if (__DEV__ && Reactotron) {
		Reactotron.display({
			name: `📊 ${stateName}`,
			value,
			preview: `Stato: ${stateName}`,
		});
	}
};

/**
 * Log di un'azione dell'utente
 * @param {string} action - L'azione eseguita
 * @param {any} details - Dettagli aggiuntivi
 */
export const logUserAction = (action, details) => {
	if (__DEV__ && Reactotron) {
		Reactotron.display({
			name: `🧑‍💻 Azione utente: ${action}`,
			value: details,
			preview: action,
		});
	}
};
