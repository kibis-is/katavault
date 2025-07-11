import type { FunctionComponent } from 'preact';

// components
import Stack from '@/ui/components/Stack';

// types
import type { StackProps } from '@/ui/types';

const VStack: FunctionComponent<Omit<StackProps, 'direction'>> = (props) => (
  <Stack {...props} direction="vertical" />
);

export default VStack;
