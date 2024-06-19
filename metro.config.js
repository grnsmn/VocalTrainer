const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver = {
	...config.resolver,
	extraNodeModules: {
		'lottie-react-native': path.resolve(
			__dirname,
			'node_modules/react-native-web-lottie',
		),
	},
};

module.exports = config;
