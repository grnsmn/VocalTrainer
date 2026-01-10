module.exports = {
  // File to read current version from
  packageFiles: [{ filename: 'package.json', type: 'json' }],
  
  // Files to update with new version
  bumpFiles: [
    // package.json - standard npm version
    { filename: 'package.json', type: 'json' },
    
    // app.json - expo.version (e.g. "2.1.0")
    { filename: 'app.json', updater: require.resolve('standard-version-expo') },
    
    // app.json - android.versionCode (incremental integer)
    { filename: 'app.json', updater: require.resolve('standard-version-expo/android') },
    
    // app.json - ios.buildNumber (incremental string)
    { filename: 'app.json', updater: require.resolve('standard-version-expo/ios') }
  ]
};
