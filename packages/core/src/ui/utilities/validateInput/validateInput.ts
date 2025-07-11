// types
import type { Parameters } from './types';

/**
 * Validates whether an input is valid.
 * @param {Parameters} params - The field name, a translation function, a custom validation function and the value.
 * @param {boolean} params.required - The field name.
 * @param {TFunction} params.translate - A function to translate strings.
 * @param {(value: string) => string | null} params.validate - A custom validation function.
 * @param {string} params.value - The value to validate.
 * @returns {string | null} The human-readable error or null if the value passed validation.
 */
export default function validateInput({ required = false, translate, validate, value }: Parameters): string | null {
  if (value.length <= 0 && required) {
    return translate('errors.inputs.required');
  }

  // custom validations
  if (validate) {
    return validate(value);
  }

  return null;
}
