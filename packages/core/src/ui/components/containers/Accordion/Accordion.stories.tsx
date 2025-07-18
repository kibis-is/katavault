import type { Meta, StoryObj } from '@storybook/preact';
import { useCallback, useState } from 'preact/hooks';

// components
import Accordion from './Accordion';
import AccordionTitle from '@/ui/components/AccordionTitle';
import Text from '@/ui/components/typography/Text';
import VStack from '@/ui/components/layouts/VStack';

// types
import { Props } from './types';

const meta: Meta<Props> = {
  args: {
    colorMode: 'dark',
  },
  component: Accordion,
  decorators: [
    (Story, { args, globals }) => {
      // states
      const [open, setOpen] = useState<boolean>(false);
      // callbacks
      const handleOnClick = useCallback(() => setOpen(!open), [open, setOpen]);

      return Story({
        args: {
          ...args,
          content: (
            <VStack align="center" height={200} justify="center" spacing="xs" width={350}>
              <Text colorMode={globals.theme} textAlign="center">
                {`Hello humie!!!`}
              </Text>
            </VStack>
          ),
          onClick: handleOnClick,
          open,
          title: (
            <AccordionTitle colorMode={globals.theme} title="More information" />
          ),
        },
      });
    },
  ],
  title: 'Components/Accounts/Accordion',
};

export const WithDarkColorMode: StoryObj<Props> = {
  globals: {
    theme: 'dark',
  },
  render: (props, { globals }) => <Accordion {...props} colorMode={globals.theme} />,
};

export const WithLightColorMode: StoryObj<Props> = {
  globals: {
    theme: 'light',
  },
  render: (props, { globals }) => <Accordion {...props} colorMode={globals.theme} />,
};

export default meta;
