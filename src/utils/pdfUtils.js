/**
 * Utility functions for PDF handling across platforms
 */

/**
 * Generates a Google Docs Viewer URL for PDF viewing
 * @param {string} pdfUrl - The direct URL to the PDF file
 * @returns {string} - Google Docs Viewer URL
 */
export const getGoogleDocsViewerUrl = pdfUrl => {
	if (!pdfUrl) {
		console.warn('PDF URL is required for Google Docs Viewer');
		return null;
	}

	return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
		pdfUrl,
	)}`;
};

/**
 * Validates if a URL is a valid PDF URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if URL appears to be a PDF
 */
export const isValidPdfUrl = url => {
	if (!url || typeof url !== 'string') {
		return false;
	}

	// Check if URL ends with .pdf or contains PDF in the path
	return (
		url.toLowerCase().includes('.pdf') ||
		url.toLowerCase().includes('pdf') ||
		(url.includes('storage/buckets') && url.includes('/files/'))
	);
};

/**
 * Extracts filename from PDF URL for display purposes
 * @param {string} url - PDF URL
 * @returns {string} - Clean filename without extension
 */
export const extractPdfFilename = url => {
	if (!url) return 'Documento PDF';

	try {
		// Try to extract from URL path
		const urlPath = new URL(url).pathname;
		const filename = urlPath.split('/').pop();

		if (filename && filename.includes('.pdf')) {
			return filename.replace('.pdf', '');
		}

		return filename || 'Documento PDF';
	} catch (error) {
		// Fallback: try to extract from string
		const parts = url.split('/');
		const lastPart = parts[parts.length - 1];

		if (lastPart && lastPart.includes('.pdf')) {
			return lastPart.replace('.pdf', '');
		}

		return 'Documento PDF';
	}
};

/**
 * Common styles for PDF viewers
 */
export const pdfViewerStyles = {
	container: {
		flex: 1,
	},
	webview: {
		flex: 1,
	},
	iframe: {
		width: '100%',
		height: '100%',
	},
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	errorText: {
		fontSize: 16,
		color: '#ff4444',
		textAlign: 'center',
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingText: {
		fontSize: 16,
		color: '#666',
		marginTop: 10,
	},
};
