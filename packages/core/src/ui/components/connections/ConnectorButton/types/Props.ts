import type { IDiscoverResult } from '@agoralabs-sh/avm-web-provider';

// types
import type { BaseComponentProps } from '@/ui/types';

interface ComponentProps {
  connector: IDiscoverResult;
  onClick: () => void;
}

type Props = BaseComponentProps & ComponentProps;

export default Props;
