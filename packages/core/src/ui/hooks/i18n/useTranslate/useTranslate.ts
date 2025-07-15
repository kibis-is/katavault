import type { TFunction } from 'i18next';
import { useContext } from 'preact/hooks';

// contexts
import { AppContext } from '@/ui/contexts';

export default function useTranslate(): TFunction {
  // contexts
  const { state } = useContext(AppContext);

  return state?.i18n.t || ((() => '') as TFunction);
}
