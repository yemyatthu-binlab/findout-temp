module.exports = {
	preset: 'react-native',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
	setupFilesAfterEnv: [
		'./node_modules/react-native-gesture-handler/jestSetup.js',
		'<rootDir>/jest.setup.js',
	],
	transformIgnorePatterns: [
		'node_modules/(?!(jest-)?react-native|@react-native|@react-native-community|@react-navigation|ky|axios|@react-native-firebase|nativewind|@shopify/flash-list|@fortawesome/react-native-fontawesome|@fortawesome/fontawesome-svg-core|@d11/react-native-fast-image)',
	],
	collectCoverageFrom: [
		'<rootDir>/src/components/**/*.{ts,tsx}',
		'<rootDir>/src/screens/**/*.{ts,tsx}',
		'<rootDir>/src/hooks/**/*.{ts,tsx}',
		'<rootDir>/src/services/**/*.{ts,tsx}',
		'<rootDir>/src/store/**/*.{ts,tsx}',
		'<rootDir>/src/util/**/*.{ts,tsx}',
		'<rootDir>/src/App.tsx',
		'!<rootDir>/src/**/*.d.ts',
	],
	moduleNameMapper: {
		'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
			'<rootDir>/src/_mocks_/fileMock.js',
	},
	coverageReporters: ['html', 'text', 'text-summary', 'cobertura'],
	testMatch: ['**/*.test.ts?(x)', '**/*.test.js?(x)'],
};
