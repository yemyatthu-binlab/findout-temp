module.exports = {
	// Where your translation files are stored
	locales: ['en'],

	// The default namespace for your translations
	defaultNamespace: 'translation', // This will generate `translation.json`

	// Where to output the extracted keys
	output: 'src/translations/$LOCALE/$NAMESPACE.json',

	// An array of glob patterns to find your source files
	input: ['src/**/*.{js,jsx,ts,tsx}'],

	// Options for parsing
	sort: true, // Sort keys alphabetically

	// This will use the text as the key, which is not what we want.
	// Set to false to generate keys from the text.
	keyAsDefaultValue: false,

	// A function to create a key from the text. This is the magic!
	// It converts "Selected contributors only" to "selectedContributorsOnly"
	keyfromText: text => {
		return (
			text
				.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
				.trim()
				// camelCase the string
				.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
					index === 0 ? word.toLowerCase() : word.toUpperCase(),
				)
				.replace(/\s+/g, '')
		);
	},
};
