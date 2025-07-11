import type { FunctionComponent } from 'preact';

// components
import Stack from '@/apps/components/Stack';

// types
import type { StackProps } from '@/apps/types';

const HStack: FunctionComponent<Omit<StackProps, 'direction'>> = (props) => (
  <Stack {...props} direction="horizontal" />
);

export default HStack;
