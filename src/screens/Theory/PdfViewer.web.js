import React, { useState } from 'react';
import { View, Text } from 'react-native';
import {
	getGoogleDocsViewerUrl,
	isValidPdfUrl,
	extractPdfFilename,
	pdfViewerStyles,
} from '@/src/utils/pdfUtils';

const PdfViewer = ({ route }) => {
	const { url, title } = route.params;
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Validate PDF URL
	if (!isValidPdfUrl(url)) {
		return (
			<View style={pdfViewerStyles.errorContainer}>
				<Text style={pdfViewerStyles.errorText}>
					URL PDF non valido
				</Text>
			</View>
		);
	}

	// Generate Google Docs Viewer URL
	const pdfUrl = getGoogleDocsViewerUrl(url);
	const displayTitle = title || extractPdfFilename(url);

	const handleLoad = () => {
		setLoading(false);
		setError(null);
	};

	const handleError = () => {
		console.error('iframe error loading PDF');
		setError('Errore nel caricamento del PDF');
		setLoading(false);
	};

	if (error) {
		return (
			<View style={pdfViewerStyles.errorContainer}>
				<Text style={pdfViewerStyles.errorText}>{error}</Text>
			</View>
		);
	}

	return (
		<View style={pdfViewerStyles.container}>
			{loading && (
				<View style={pdfViewerStyles.loadingContainer}>
					<Text style={pdfViewerStyles.loadingText}>
						Caricamento {displayTitle}...
					</Text>
				</View>
			)}
			<iframe
				src={pdfUrl}
				style={pdfViewerStyles.iframe}
				frameBorder="10"
				onLoad={handleLoad}
				onError={handleError}
				title={`PDF Viewer - ${displayTitle}`}
			/>
		</View>
	);
};

export default PdfViewer;
