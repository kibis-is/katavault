import BigNumber from 'bignumber.js';
import numbro from 'numbro';

// types
import type { FormatUnitOptions } from '@/types';

/**
 * Formats a given unit to for display in the UI.
 * *
 * @param {BigNumber} value - The unit as a BigNumber.
 * @param {FormatUnitOptions} [options] - Options to customize the format.
 * @param {number} [options.decimals] - The decimals that will be displayed after the whole number. Defaults to 2.
 * @param {number} [options.thousandSeparatedOnly] - Whether to use a thousand separated only for big numbers. Defaults
 * to false.
 * @returns {string} The formatted unit as a string.
 */
export default function formatUnit(value: BigNumber, options?: FormatUnitOptions): string {
  const decimals = options?.decimals || 2;
  const thousandSeparatedOnly = options?.thousandSeparatedOnly || false;

  if (value.gte(1)) {
    // numbers >= 1m+
    if (value.decimalPlaces(decimals).gte(new BigNumber(1000000)) && !thousandSeparatedOnly) {
      return numbro(value.toString()).format({
        average: true,
        totalLength: 6,
        trimMantissa: true,
      });
    }

    // numbers >= 1 && <= 999,999.99
    return numbro(value.toString()).format({
      mantissa: decimals,
      thousandSeparated: true,
      trimMantissa: true,
    });
  }

  // numbers < 1
  return numbro(value.toString()).format({
    mantissa: decimals,
    trimMantissa: true,
  });
}
