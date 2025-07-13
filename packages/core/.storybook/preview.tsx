import { createLogger } from '@kibisis/utilities';
import { ArgTypes, Description, Title } from '@storybook/addon-docs';
import type { Preview } from '@storybook/preact';
import i18next, { type i18n as I18n } from 'i18next';
import { useEffect, useMemo } from 'preact/hooks';

// providers
import AppProvider from '@/ui/providers/AppProvider';

// styles
import './styles.scss';

// translations
import { en } from '@/ui/translations';

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const i18n = useMemo<I18n>(() => i18next.createInstance({
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false,
        },
        resources: {
          en: {
            translation: en,
          },
        },
      }), []);

      useEffect(() => {
        (async () => await i18n.init())();
      }, []);
      useEffect(() => document.body.setAttribute('data-color-mode', context.globals.theme), [context.globals.theme]);

      return (
        <AppProvider
          clientInformation={{
            hostname: 'localhost',
            name: 'Katavault',
          }}
          i18n={i18n}
          logger={createLogger('debug')}
        >
          {Story()}
        </AppProvider>
      );
    },
  ],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Description />
          <ArgTypes />
        </>
      ),
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default preview;
