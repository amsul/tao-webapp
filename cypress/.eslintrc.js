module.exports = {
	extends: ['../.eslintrc.js', 'plugin:testing-library/react'],
	parserOptions: {
		project: __dirname + '/tsconfig.json',
		sourceType: 'module',
	},
	rules: {
		'import/no-anonymous-default-export': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'cypress/no-assigning-return-values': 'error',
		'cypress/no-unnecessary-waiting': 'error',
		'cypress/assertion-before-screenshot': 'warn',
		'cypress/no-force': 'warn',
		'cypress/no-async-tests': 'error',
		'jest/valid-expect': 'off',
		'jest/valid-expect-in-promise': 'off',
		'testing-library/await-async-query': 'off',
		'testing-library/await-async-utils': 'off',
		'testing-library/prefer-screen-queries': 'off',
	},
}
