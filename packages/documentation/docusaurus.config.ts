import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { resolve } from 'node:path';
import { themes } from 'prism-react-renderer';

const config: () => Promise<Config> = async () => {
  // directories
  const docsDir = resolve(__dirname, 'docs');
  const staticDir = resolve(docsDir, 'static');
  const scriptsDir = resolve(docsDir, 'scripts');
  const stylesDir = resolve(docsDir, 'styles');
  // links
  const organizationName = 'kibis-is';
  const projectName = 'embedded-wallet-sdk';
  const githubLink = `https://github.com/${organizationName}/${projectName}`;
  const npmLink = `https://npmjs.com/package/@kibisis/${projectName}`;
  const url = 'https://avm-web-provider.agoralabs.sh';
  // header
  const tagline = 'A TypeScript/JavaScript SDK that allows dApps to securely embed wallets using IndexedDB and leveraging WebAuthn for private key encryption.';
  const title = 'Embedded Wallet SDK';

  return {
    baseUrl: '/',
    deploymentBranch: 'gh-pages',
    favicon: 'images/favicon.png',
    i18n: {
      defaultLocale: 'en',
      locales: ['en'],
    },
    onBrokenLinks: 'warn',
    onBrokenMarkdownLinks: 'throw',
    onDuplicateRoutes: 'throw',
    organizationName,
    projectName,
    plugins: ['docusaurus-plugin-sass'],
    presets: [
      [
        'classic',
        {
          blog: false,
          docs: {
            lastVersion: 'current',
            remarkPlugins: [
              [
                await import('@docusaurus/remark-plugin-npm2yarn'),
                {
                  sync: true,
                },
              ],
            ],
            routeBasePath: '/',
            sidebarPath: resolve(scriptsDir, 'sidebars.js'),
            versions: {
              current: {
                label: '1.0.0',
              },
            },
          },
          sitemap: {
            changefreq: 'weekly',
            priority: 0.5,
            ignorePatterns: ['/tags/**'],
            filename: 'sitemap.xml',
          },
          theme: {
            customCss: [
              resolve(stylesDir, 'main.scss'),
            ],
          },
        } satisfies Preset.Options,
      ],
    ],
    staticDirectories: [staticDir],
    tagline,
    themeConfig: {
      metadata: [
        {
          name: 'keywords',
          content: 'algorand, algosdk, avm, blockchain, voi',
        },
      ],
      navbar: {
        title,
        items: [
          {
            type: 'doc',
            docId: 'overview',
            position: 'left',
            label: 'Overview',
          },
          {
            type: 'doc',
            docId: 'usage/index',
            position: 'left',
            label: 'Usage',
          },
          {
            type: 'doc',
            docId: 'api-reference/index',
            position: 'left',
            label: 'API',
          },
          // right
          {
            type: 'docsVersionDropdown',
            position: 'right',
          },
          {
            href: githubLink,
            position: 'right',
            className: 'navbar__icon navbar__icon--github',
            'aria-label': 'GitHub repository',
          },
          {
            href: npmLink,
            position: 'right',
            className: 'navbar__icon navbar__icon--npm',
            'aria-label': 'npm registry',
          },
        ],
      },
      footer: {
        copyright: `
<div class="footer__copyright-container">
    <p class="footer__text">Licensed under <a class="footer__text--link" href="${githubLink}/blob/main/LICENSE" target="_blank">CC0</a>.</p>
</div>
        `,
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Overview',
                to: '/',
              },
              {
                label: 'Usage',
                to: 'usage',
              },
              {
                label: 'API Reference',
                to: 'api-reference',
              },
              {
                label: 'Terminology',
                to: 'terminology',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: githubLink,
              },
              {
                label: 'npm',
                href: npmLink,
              },
            ],
          },
        ],
        style: 'dark',
      },
      prism: {
        darkTheme: themes.dracula,
        theme: themes.github,
      },
    } satisfies Preset.ThemeConfig,
    title,
    trailingSlash: false,
    url,
  };
};

export default config;
