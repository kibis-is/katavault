// hooks
import useMediaQuery from '@/ui/hooks/screens/useMediaQuery';

export default function useMobileOnly(): boolean {
  return useMediaQuery('(max-width: 768px - 1px)');
}
