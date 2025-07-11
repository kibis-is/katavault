import type { TFunction } from 'i18next';
import { useContext, useEffect, useState } from 'preact/hooks';

// contexts
import { AppContext } from '@/ui/contexts';

export default function useTranslate(): TFunction {
  const { state, timestamp } = useContext(AppContext);
  const [translate, setTranslate] = useState<TFunction>((() => undefined) as TFunction);

  useEffect(() => {
    if (!state) {
      return;
    }

    setTranslate(state.i18n.t);
  }, [timestamp]);

  return translate;
}
