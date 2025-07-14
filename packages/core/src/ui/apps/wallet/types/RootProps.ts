// types
import type { BaseAppProps } from '@/ui/types';
import type AppProps from './AppProps';

type RootProps = Pick<BaseAppProps, 'onClose'> & Omit<AppProps, 'chains'>;

export default RootProps;
