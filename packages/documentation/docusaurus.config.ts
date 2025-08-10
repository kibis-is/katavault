import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { resolve } from 'node:path';
import { themes } from 'prism-react-renderer';

const config: () => Promise<Config> = async () => {
  // directories
  const srcDir = resolve(__dirname, 'src');
  // links
  const organizationName = 'kibis-is';
  const projectName = 'katavault';
  const githubLink = `https://github.com/${organizationName}/${projectName}`;
  const npmLink = `https://www.npmjs.com/package/@kibisis/katavault-core`;
  const url = 'https://docs.katavault.kibis.is';
  // header
  const tagline = 'A TypeScript/JavaScript SDK that allows dApps to securely embed wallets using IndexedDB and leveraging modern encryption techniques, such as WebAuthn, to securely store private keys.';
  const title = 'Katavault';

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
            versions: {
              current: {
                label: '1.x',
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
              resolve(srcDir, 'styles', 'index.scss'),
            ],
          },
        } satisfies Preset.Options,
      ],
    ],
    staticDirectories: [resolve(__dirname, 'public')],
    tagline,
    themeConfig: {
      metadata: [
        {
          name: 'keywords',
          content: 'algorand, algosdk, avm, blockchain, voi',
        },
      ],
      navbar: {
        items: [
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
        logo: {
          alt: 'Katavault logo',
          src: 'images/logo-light.svg',
          srcDark: 'images/logo-dark.svg',
        },
        title,
      },
      footer: {
        copyright: `
<div class="footer__copyright-container">
    <p class="footer__text">Licensed under <a class="footer__text--link" href="${githubLink}/blob/main/LICENSE" target="_blank">CC0</a>.</p>
</div>
        `,
        links: [
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
