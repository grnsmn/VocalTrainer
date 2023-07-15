module.exports = {
	root: true,
	plugins: ['simple-import-sort'],
	extends: '@react-native-community',
	rules: {
		'react-hooks/exhaustive-deps': 0,
		'react/destructuring-assignment': ['error', 'always'],
		'simple-import-sort/exports': 'error',
		'simple-import-sort/imports': [
			'error',
			{
				groups: [
					// React imports
					['^react$', '^react-native$'],
					// other default import
					// Side effect imports.
					['^\\u0000'],
					// Node.js builtins prefixed with `node:`.
					['^node:'],
					// Packages.
					// Things that start with a letter (or digit or underscore), or `@` followed by a letter.
					['^@?\\w'],
					// Absolute imports and other imports such as Vue-style `@/foo`.
					// Anything not matched in another group.
					['^'],
					// Relative imports.
					// Anything that starts with a dot.
					['^\\.'],
				],
			},
		],
	},
};
