// types
import type { BaseAppProps } from '@/ui/types';
import type AppProps from './AppProps';

type RootProps = Pick<BaseAppProps, 'debug' | 'onClose'> & Omit<AppProps, 'chains'>;

export default RootProps;
