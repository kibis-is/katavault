import type { TFunction } from 'i18next';

interface Parameters {
  field?: string;
  required?: boolean;
  translate: TFunction;
  validate?: (value: string) => string | null;
  value: string;
}

export default Parameters;
