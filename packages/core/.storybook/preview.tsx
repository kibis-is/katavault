import { ArgTypes, Description, Title } from '@storybook/addon-docs';
import type { Preview } from '@storybook/preact';
import { useEffect } from 'preact/hooks';

// styles
import './styles.scss';

const preview: Preview = {
  decorators: [
    (Story, context) => {
      useEffect(() => document.body.setAttribute('data-color-mode', context.globals.theme), [context.globals.theme]);

      return Story();
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
