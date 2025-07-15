import copy from 'copy-to-clipboard';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';

// types
import type { State } from './types';

export default function useClipboard(text: string): State {
  // memos
  const timeout = useMemo(() => 1500, []);
  // states
  const [copied, setCopied] = useState<boolean>(false);
  const [value, _setValue] = useState<string>(text);
  // callbacks
  const onCopy = useCallback(() => {
    (async () => {
      if (!navigator.clipboard) {
        setCopied(copy(value));

        return;
      }

      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
      } catch (_) {
        setCopied(copy(value));
      }
    })();
  }, [setCopied, value]);
  const setValue = useCallback(
    (_value: string) => {
      setValue(_value);
    },
    [_setValue]
  );

  useEffect(() => {
    let timeoutId: number | null = null;

    if (copied) {
      timeoutId = window.setTimeout(() => setCopied(false), timeout);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [copied]);

  return {
    copied,
    onCopy,
    setValue,
    value,
  };
}
