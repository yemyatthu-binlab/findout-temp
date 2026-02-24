import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/findout-temp/__docusaurus/debug',
    component: ComponentCreator('/findout-temp/__docusaurus/debug', '440'),
    exact: true
  },
  {
    path: '/findout-temp/__docusaurus/debug/config',
    component: ComponentCreator('/findout-temp/__docusaurus/debug/config', '8de'),
    exact: true
  },
  {
    path: '/findout-temp/__docusaurus/debug/content',
    component: ComponentCreator('/findout-temp/__docusaurus/debug/content', '8d1'),
    exact: true
  },
  {
    path: '/findout-temp/__docusaurus/debug/globalData',
    component: ComponentCreator('/findout-temp/__docusaurus/debug/globalData', '807'),
    exact: true
  },
  {
    path: '/findout-temp/__docusaurus/debug/metadata',
    component: ComponentCreator('/findout-temp/__docusaurus/debug/metadata', 'fd4'),
    exact: true
  },
  {
    path: '/findout-temp/__docusaurus/debug/registry',
    component: ComponentCreator('/findout-temp/__docusaurus/debug/registry', '814'),
    exact: true
  },
  {
    path: '/findout-temp/__docusaurus/debug/routes',
    component: ComponentCreator('/findout-temp/__docusaurus/debug/routes', 'fb7'),
    exact: true
  },
  {
    path: '/findout-temp/docs',
    component: ComponentCreator('/findout-temp/docs', 'c08'),
    routes: [
      {
        path: '/findout-temp/docs/building-release',
        component: ComponentCreator('/findout-temp/docs/building-release', '3cf'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/findout-temp/docs/ci-cd',
        component: ComponentCreator('/findout-temp/docs/ci-cd', '11a'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/findout-temp/docs/development-guide',
        component: ComponentCreator('/findout-temp/docs/development-guide', '02b'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/findout-temp/docs/getting-started',
        component: ComponentCreator('/findout-temp/docs/getting-started', '095'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/findout-temp/docs/intro',
        component: ComponentCreator('/findout-temp/docs/intro', '285'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/findout-temp/docs/project-architecture',
        component: ComponentCreator('/findout-temp/docs/project-architecture', '38a'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/findout-temp/docs/services-integration',
        component: ComponentCreator('/findout-temp/docs/services-integration', 'ffd'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/findout-temp/docs/troubleshooting',
        component: ComponentCreator('/findout-temp/docs/troubleshooting', '63c'),
        exact: true,
        sidebar: "docs"
      }
    ]
  },
  {
    path: '/findout-temp/',
    component: ComponentCreator('/findout-temp/', '0b0'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
