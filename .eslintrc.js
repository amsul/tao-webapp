/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'react-app',
		'@remix-run/eslint-config',
		'@remix-run/eslint-config/node',
		'@remix-run/eslint-config/jest-testing-library',
		'prettier',
	],
	plugins: ['@typescript-eslint', 'react-hooks', 'cypress', 'testing-library'],
	env: {
		'cypress/globals': true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: __dirname + '/tsconfig.json',
	},
	// we're using vitest which has a very similar API to jest
	// (so the linting plugins work nicely), but it means we have to explicitly
	// set the jest version.
	settings: {
		jest: {
			version: 28,
		},
	},
	rules: {
		curly: ['warn'],
		'no-else-return': [
			'warn',
			{
				allowElseIf: false,
			},
		],
		'no-restricted-imports': [
			'error',
			{
				patterns: ['.*'],
			},
		],
		'react/jsx-boolean-value': ['warn', 'always'],
		// 'react/jsx-no-literals': [
		// 	'warn',
		// 	{
		// 		noStrings: true,
		// 		ignoreProps: true,
		// 	},
		// ],
		'@typescript-eslint/array-type': [
			'error',
			{
				'array-simple': true,
			},
		],
		'@typescript-eslint/strict-boolean-expressions': [
			'error',
			{
				allowString: false,
				allowNumber: false,
			},
		],
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': [
			'warn',
			{
				additionalHooks: 'useRecoilCallback|useRecoilTransaction_UNSTABLE',
			},
		],
	},
}
