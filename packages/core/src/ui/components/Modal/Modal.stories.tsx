import type { Meta, StoryObj } from '@storybook/preact';
import { useCallback, useState } from 'preact/hooks';

// components
import Button from '@/ui/components/Button';
import Heading from '@/ui/components/Heading';
import HStack from '@/ui/components/HStack';
import IconButton from '@/ui/components/IconButton';
import Modal from './Modal';
import Spacer from '@/ui/components/Spacer';
import Text from '@/ui/components/Text';
import VStack from '@/ui/components/VStack';

// constants
import { DEFAULT_PADDING } from '@/ui/constants';

// icons
import CloseIcon from '@/ui/icons/CloseIcon';

// types
import { Props } from './types';

const meta: Meta<Props> = {
  args: {
    colorMode: 'dark',
  },
  component: Modal,
  decorators: [
    (Story, { args, globals }) => {
      // states
      const [open, setOpen] = useState<boolean>(false);
      // callbacks
      const handleToggleOpenClick = useCallback(() => setOpen(!open), [open, setOpen]);

      return (
        <>
          {Story({
            args: {
              ...args,
              body: (
                <VStack align="center" fullWidth={true} height={200} justify="center" spacing="xs">
                  <Text colorMode={globals.theme} textAlign="center">Hello humie!!</Text>
                </VStack>
              ),
              footer: (
                <VStack align="center" fullWidth={true} justify="center" padding={DEFAULT_PADDING}>
                  <Button colorMode={globals.theme} fullWidth={true} onClick={handleToggleOpenClick}>
                    Close
                  </Button>
                </VStack>
              ),
              onClose: handleToggleOpenClick,
              open,
            },
          })}

          <Button colorMode={globals.theme} onClick={handleToggleOpenClick}>
            Open modal
          </Button>
        </>
      );
    },
  ],
  title: 'Components/Layouts/Modal',
};

export const WithDarkColorMode: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => <Modal {...props} colorMode={globals.theme} />,
};

export const WithLightColorMode: StoryObj<Props> = {
  globals: {
    theme: 'light',
  },
  render: (props, { globals }) => <Modal {...props} colorMode={globals.theme} />,
};

export const CloseOnClickOutside: StoryObj<Props> = {
  render: (props) => <Modal {...props} closeOnInteractOutside={true} />,
};

export const WithHeader: StoryObj<Props> = {
  render: (props, { globals }) => <Modal
    {...props}
    header={(
      <HStack align="center" fullWidth={true} padding={DEFAULT_PADDING} spacing="xs">
        <Heading colorMode={globals.theme} fullWidth={true} textAlign="left">
          A very boring modal header
        </Heading>

        <Spacer />

        {/*close button*/}
        <IconButton colorMode={globals.theme} icon={<CloseIcon />} onClick={() => props.onClose()} />
      </HStack>
    )}
  />,
};

export default meta;
