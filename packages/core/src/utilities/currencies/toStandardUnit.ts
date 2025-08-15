import BigNumber from 'bignumber.js';

// types
import type { CurrencyConversionParameters } from '@/types';

/**
 * Converts an atomic unit to a standard unit.
 *
 * @param {CurrencyConversionParameters} params - The input parameters.
 * @param {number} params.decimals - The decimals used to convert to a standard unit.
 * @param {BigNumber} params.value - The atomic unit as a BigNumber.
 * @returns {BigNumber} The supplied atomic unit as its standard unit.
 */
export default function toStandardUnit({ decimals, value }: CurrencyConversionParameters): BigNumber {
  const power: BigNumber = new BigNumber(10).pow(decimals);

  return value.dividedBy(power);
}
