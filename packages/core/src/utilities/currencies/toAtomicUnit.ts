import BigNumber from 'bignumber.js';

// types
import type { CurrencyConversionParameters } from '@/types';

/**
 * Converts a standard unit to an atomic unit.
 *
 * @param {CurrencyConversionParameters} params - The input parameters.
 * @param {number} params.decimals - The decimals used to convert to an atomic unit.
 * @param {BigNumber} params.value - The standard unit as a BigNumber.
 * @returns {BigNumber} The supplied standard unit as its atomic unit.
 */
export default function toAtomicUnit({ decimals, value }: CurrencyConversionParameters): BigNumber {
  const power: BigNumber = new BigNumber(10).pow(decimals);

  return value.multipliedBy(power);
}
