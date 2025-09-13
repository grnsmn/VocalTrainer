import React from 'react';
import { View, StyleSheet } from 'react-native';

const PdfViewer = ({ route }) => {
  const { url } = route.params;

  // Usiamo Google Docs Viewer per wrappare l'URL del PDF
  const pdfUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;

  return (
    <View style={styles.container}>
      <iframe
        src={pdfUrl}
        style={styles.iframe}
        frameBorder="0"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iframe: {
    width: '100%',
    height: '100%',
  },
});

export default PdfViewer;
