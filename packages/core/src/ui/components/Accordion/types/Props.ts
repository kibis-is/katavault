import type { JSX } from 'preact';

// types
import type { BaseComponentProps } from '@/ui/types';

interface ComponentProps {
  content: JSX.Element;
  onClick: () => void;
  open: boolean;
  padding?: number | string;
  paddingBottom?: number | string;
  paddingLeft?: number | string;
  paddingRight?: number | string;
  paddingTop?: number | string;
  paddingX?: number | string;
  paddingY?: number | string;
  title: JSX.Element;
}

type Props = ComponentProps & BaseComponentProps;

export default Props;
