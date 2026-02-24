/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
	docs: [
		'intro',
		{
			type: 'category',
			label: 'Guides',
			items: [
				'getting-started',
				'project-architecture',
				'development-guide',
				'building-release',
				'services-integration',
				'ci-cd',
				'troubleshooting',
			],
		},
	],
};

module.exports = sidebars;
