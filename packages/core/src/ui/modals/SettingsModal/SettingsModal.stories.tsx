import type { Meta, StoryObj } from '@storybook/preact';
import { useCallback, useState } from 'preact/hooks';

// components
import Button from '@/ui/components/buttons/Button';

// modals
import SettingsModal from './SettingsModal';

// types
import { Props } from './types';

const meta: Meta<Props> = {
  args: {
    colorMode: 'dark',
    onClose: () => {},
    open: true,
  },
  component: SettingsModal,
  decorators: [
    (Story, { args, globals }) => {
      // states
      const [open, setOpen] = useState<boolean>(false);
      // callbacks
      const onClose = useCallback(() => setOpen(false), [setOpen]);
      const onLogout = useCallback(() => setOpen(false), [setOpen]);

      return (
        <>
          {/*modal*/}
          {Story({
            args: {
              ...args,
              open,
              onClose,
              onLogout,
            },
          })}

          <Button colorMode={globals.theme} onClick={() => setOpen(true)}>
            {`Open modal`}
          </Button>
        </>
      );
    },
  ],
  globals: {
    theme: 'dark',
  },
  title: 'Modals/SettingsModal',
};

export const WithDarkColorMode: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => (
    <SettingsModal {...props}  colorMode={globals.theme} />
  ),
};

export const WithLightColorMode: StoryObj<Props> = {
  globals: {
    theme: 'light',
  },
  render: (props, { globals }) => (
    <SettingsModal {...props} colorMode={globals.theme} />
  ),
};

export default meta;
