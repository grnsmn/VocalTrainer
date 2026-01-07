import { useEffect, useState } from 'react';
import { Storage, Client, Account } from 'react-native-appwrite';
import APPWRITE_CONFIG from '@/src/config/appwrite';

let client;

client = new Client();
client
	.setEndpoint(APPWRITE_CONFIG.endpoint)
	.setProject(APPWRITE_CONFIG.projectId)
	.setPlatform(APPWRITE_CONFIG.platform);

const storage = new Storage(client);
const account = new Account(client);

const useAppwriteStorage = ({ bucketId = APPWRITE_CONFIG.bucketId } = {}) => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchFiles = async () => {
			try {
				setLoading(true);
				setError(null);

				// Prova prima senza autenticazione
				try {
					const response = await storage.listFiles(bucketId);
					setData(response.files || []);
				} catch (authError) {
					// Se fallisce per autenticazione, prova con autenticazione anonima
					if (authError.code === 401) {
						console.log('Tentativo di autenticazione anonima...');
						await account.createAnonymousSession();
						const response = await storage.listFiles(bucketId);
						setData(response.files || []);
					} else {
						throw authError;
					}
				}
			} catch (err) {
				console.error('Error fetching files from Appwrite:', err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchFiles();
	}, [bucketId]);

	const getFileUrl = async fileId => {
		try {
			// Costruisci manualmente l'URL del file per la visualizzazione
			const endpoint = APPWRITE_CONFIG.endpoint;
			const projectId = APPWRITE_CONFIG.projectId;

			// Prova prima con URL pubblico
			let url = `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;

			// Se il bucket richiede autenticazione, prova a ottenere un token
			try {
				// Verifica se abbiamo una sessione attiva
				const session = await account.getSession('current');
				if (session) {
					// Aggiungi il token di autenticazione all'URL
					url = `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}&jwt=${
						session.providerAccessToken || session.$id
					}`;
				}
			} catch (authError) {
				// Se non c'è sessione, prova a crearne una anonima
				try {
					await account.createAnonymousSession();
					const session = await account.getSession('current');
					if (session) {
						url = `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}&jwt=${
							session.providerAccessToken || session.$id
						}`;
					}
				} catch (anonError) {
					console.log('Usando URL pubblico senza autenticazione');
				}
			}

			return url;
		} catch (err) {
			console.error('Error getting file URL:', err);
			return null;
		}
	};

	const getFileDownload = fileId => {
		try {
			return storage.getFileDownload({ bucketId, fileId });
		} catch (err) {
			console.error('Error getting file download URL:', err);
			return null;
		}
	};

	const refreshData = async () => {
		try {
			setLoading(true);
			setError(null);

			// Prova prima senza autenticazione
			try {
				const response = await storage.listFiles(bucketId);
				setData(response.files || []);
			} catch (authError) {
				// Se fallisce per autenticazione, prova con autenticazione anonima
				if (authError.code === 401) {
					console.log('Tentativo di autenticazione anonima...');
					await account.createAnonymousSession();
					const response = await storage.listFiles(bucketId);
					setData(response.files || []);
				} else {
					throw authError;
				}
			}
		} catch (err) {
			console.error('Error refreshing files from Appwrite:', err);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return {
		data,
		loading,
		error,
		getFileUrl,
		getFileDownload,
		refreshData,
	};
};

export default useAppwriteStorage;
