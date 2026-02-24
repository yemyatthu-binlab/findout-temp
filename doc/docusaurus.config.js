// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: 'FindOut Media',
	tagline: 'Developer Documentation',
	url: 'https://yemyatthu-binlab.github.io',
	baseUrl: '/findout-temp/',
	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'warn',
	favicon: 'img/favicon.ico',

	// GitHub pages deployment config.
	// If you aren't using GitHub pages, you don't need these.
	organizationName: 'yemyatthu-binlab', // Usually your GitHub org/user name.
	projectName: 'findout-temp', // Usually your repo name.
	trailingSlash: false,

	presets: [
		[
			'classic',
			/** @type {import('@docusaurus/preset-classic').Options} */
			({
				docs: {
					sidebarPath: require.resolve('./sidebars.js'),
				},
				theme: {
					customCss: require.resolve('./src/css/custom.css'),
				},
			}),
		],
	],

	themeConfig:
		/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
		({
			navbar: {
				title: 'FindOut Media',
				items: [
					{
						type: 'doc',
						docId: 'intro',
						position: 'left',
						label: 'Documentation',
					},
				],
			},
			footer: {
				style: 'dark',
				copyright: `Copyright © ${new Date().getFullYear()} FindOut Media. Built with Docusaurus.`,
			},
			prism: {
				theme: lightCodeTheme,
				darkTheme: darkCodeTheme,
			},
		}),
};

module.exports = config;
