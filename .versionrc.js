module.exports = {
  // File da cui leggere la versione corrente
  packageFiles: [{ filename: 'package.json', type: 'json' }],
  
  // File da aggiornare con la nuova versione
  bumpFiles: [
    // package.json - versione npm standard
    { filename: 'package.json', type: 'json' },
    
    // app.json - expo.version (es. "2.1.0")
    { filename: 'app.json', updater: require.resolve('standard-version-expo') },
    
    // app.json - android.versionCode (numero intero incrementale)
    { filename: 'app.json', updater: require.resolve('standard-version-expo/android') },
    
    // app.json - ios.buildNumber (stringa incrementale)
    { filename: 'app.json', updater: require.resolve('standard-version-expo/ios') }
  ]
};
