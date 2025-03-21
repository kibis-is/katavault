// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    'overview',
    {
      items: [
        {
          items: [],
          label: 'Getting Started',
          link: {
            type: 'doc',
            id: 'usage/getting-started/index',
          },
          type: 'category',
        },
        {
          items: [],
          label: 'Core',
          link: {
            type: 'doc',
            id: 'usage/core/index',
          },
          type: 'category',
        },
        {
          items: [],
          label: 'React',
          link: {
            type: 'doc',
            id: 'usage/react/index',
          },
          type: 'category',
        },
      ],
      label: 'Usage',
      link: {
        type: 'doc',
        id: 'usage/index',
      },
      type: 'category',
    },
    {
      items: [],
      label: 'API Reference',
      link: {
        type: 'doc',
        id: 'api-reference/index',
      },
      type: 'category',
    },
    'terminology',
  ],
};

module.exports = sidebars;
