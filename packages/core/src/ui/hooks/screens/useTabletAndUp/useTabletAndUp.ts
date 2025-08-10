// hooks
import useMediaQuery from '@/ui/hooks/screens/useMediaQuery';

export default function useTabletAndUp(): boolean {
  return useMediaQuery('(min-width: 768px)');
}
