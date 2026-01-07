/**
 * Appwrite Configuration
 * Centralized configuration for Appwrite services
 */

const APPWRITE_CONFIG = {
	// Appwrite Endpoint
	endpoint:
		process.env.APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1',

	// Project ID
	projectId: process.env.APPWRITE_PROJECT_ID || '68c521460031cc555128',

	// Platform identifier
	platform: process.env.APPWRITE_PLATFORM || 'com.VocalTrainer.app',

	// Storage Bucket ID for PDFs
	bucketId: process.env.APPWRITE_BUCKET_ID || '68c6b3c10029339d2f10',
};

export default APPWRITE_CONFIG;
