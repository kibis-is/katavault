import type { FunctionComponent } from 'preact';

// components
import Stack from '@/components/Stack';

// types
import type { StackProps } from '@/types';

const HStack: FunctionComponent<Omit<StackProps, 'direction'>> = (props) => (
  <Stack {...props} direction="horizontal" />
);

export default HStack;
