import type { ChangeEvent, FocusEvent } from 'preact/compat';
import { useCallback, useState } from 'preact/hooks';

// hooks
import useTranslate from '@/ui/hooks/useTranslate';

// types
import type { Parameters, State } from './types';

// utils
import validateInput from '@/ui/utilities/validateInput';

export default function useInput<InputElement extends HTMLInputElement | HTMLTextAreaElement>({
  characterLimit,
  defaultValue,
  name,
  required,
  validate,
}: Parameters): State<InputElement> {
  // hooks
  const translate = useTranslate();
  // state
  const [charactersRemaining, setCharactersRemaining] = useState<number | null>(characterLimit || null);
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState<string>(defaultValue || '');
  // callbacks
  const _validate = useCallback(() => {
    const _error = validateInput({
      field: name,
      translate,
      required,
      value,
      validate,
    });

    setError(_error);

    return _error;
  }, [name, required, setError, translate, validate, value]);
  const onBlur = useCallback(
    (event: FocusEvent<InputElement>) => {
      setError(
        validateInput({
          field: name,
          translate,
          required,
          value: event.currentTarget.value,
          validate,
        })
      );
    },
    [name, required, setError, translate, validate]
  );
  const onChange = useCallback(
    (event: ChangeEvent<InputElement>) => {
      const _value = event.currentTarget.value;
      let byteLength: number;

      // update the characters remaining
      if (typeof characterLimit === 'number') {
        byteLength = new TextEncoder().encode(_value).byteLength;

        setCharactersRemaining(characterLimit - byteLength);
      }

      setError(
        validateInput({
          field: name,
          translate,
          required,
          value: _value,
          validate,
        })
      );
      setValue(_value);
    },
    [characterLimit, name, required, setCharactersRemaining, setError, setValue, translate, validate]
  );
  const reset = useCallback(() => {
    setCharactersRemaining(characterLimit || null);
    setError(null);
    setValue('');
  }, [setCharactersRemaining, setError, setValue, characterLimit]);

  return {
    name,
    onBlur,
    onChange,
    reset,
    required,
    setCharactersRemaining,
    setError,
    setValue,
    validate: _validate,
    value,
    ...(typeof charactersRemaining === 'number' && {
      charactersRemaining,
    }),
    ...(error && {
      error,
    }),
  };
}
