import type { FunctionComponent } from 'preact';

// components
import Stack from '@/ui/components/layouts/Stack';

// types
import type { StackProps } from '@/ui/types';

const HStack: FunctionComponent<Omit<StackProps, 'direction'>> = (props) => (
  <Stack {...props} direction="horizontal" />
);

export default HStack;
