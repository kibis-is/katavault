import type { FunctionComponent } from 'preact';

// components
import Stack from '@/apps/components/Stack';

// types
import type { StackProps } from '@/apps/types';

const VStack: FunctionComponent<Omit<StackProps, 'direction'>> = (props) => (
  <Stack {...props} direction="vertical" />
);

export default VStack;
