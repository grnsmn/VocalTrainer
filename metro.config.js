const { withNativeWind: withNativeWind } = require('nativewind/metro');

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
	unstable_conditionNames: [
		// workaround https://github.com/pmndrs/zustand/discussions/1967#discussioncomment-9578159
		'browser',
		'require',
		'react-native',
	],
};

module.exports = withNativeWind(config, {
	input: './global.css',
});
