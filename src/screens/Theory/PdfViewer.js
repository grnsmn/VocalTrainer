import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const PdfViewer = ({ route }) => {
  const { url } = route.params;

  // Per i PDF online, possiamo usare Google Docs Viewer per wrappare l'URL
  const pdfUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: pdfUrl }}
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default PdfViewer;
