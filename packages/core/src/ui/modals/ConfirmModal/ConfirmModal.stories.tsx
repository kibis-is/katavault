import type { Meta, StoryObj } from '@storybook/preact';
import { useCallback, useState } from 'preact/hooks';

// components
import Button from '@/ui/components/buttons/Button';

// modals
import ConfirmModal from './ConfirmModal';

// types
import { Props } from './types';

const meta: Meta<Props> = {
  args: {
    closeOnEscape: true,
    closeOnInteractOutside: true,
    colorMode: 'dark',
    message: 'You are about to reset the world, are you sure?',
    title: 'Reset the world',
  },
  component: ConfirmModal,
  decorators: [
    (Story, { args, globals }) => {
      // states
      const [open, setOpen] = useState<boolean>(false);
      // callbacks
      const onClose = useCallback(() => setOpen(false), [setOpen]);

      return (
        <>
          {/*modal*/}
          {Story({
            args: {
              ...args,
              onClose,
              onConfirm: onClose,
              open,
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
  title: 'Modals/ConfirmModal',
};

export const WithDarkColorMode: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => (
    <ConfirmModal {...props} colorMode={globals.theme} />
  ),
};

export const WithLightColorMode: StoryObj<Props> = {
  globals: {
    theme: 'light',
  },
  render: (props, { globals }) => (
    <ConfirmModal {...props} colorMode={globals.theme} />
  ),
};

export default meta;
