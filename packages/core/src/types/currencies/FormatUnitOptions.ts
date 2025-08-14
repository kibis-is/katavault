/**
 * @property {number} [decimals] - The decimals that will be displayed after the whole number. Defaults to 2.
 * @property {boolean} [thousandSeparatedOnly] - Whether to use a thousand separated only for big numbers. Defaults to
 * false.
 */
interface FormatUnitOptions {
  decimals?: number;
  thousandSeparatedOnly?: boolean;
}

export default FormatUnitOptions;
