import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import {
	getGoogleDocsViewerUrl,
	isValidPdfUrl,
	extractPdfFilename,
	pdfViewerStyles,
} from '@/src/utils/pdfUtils';
import Loader from '@/src/components/Loader';

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

	const handleLoadStart = () => {
		setLoading(true);
		setError(null);
	};

	const handleLoadEnd = () => {
		setLoading(false);
	};

	const handleError = syntheticEvent => {
		const { nativeEvent } = syntheticEvent;
		console.error('WebView error:', nativeEvent);
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
			<WebView
				source={{ uri: pdfUrl }}
				style={pdfViewerStyles.webview}
				renderLoading={() => <Loader />}
				onLoadStart={handleLoadStart}
				onLoadEnd={handleLoadEnd}
				onError={handleError}
				javaScriptEnabled={true}
				domStorageEnabled={true}
				startInLoadingState={true}
			/>
		</View>
	);
};

export default PdfViewer;
