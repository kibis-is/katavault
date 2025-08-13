/**
 * @property {bigint} amount - An integer representing the balance of the atomic unit.
 * @property {bigint} block - The block for which this balance is relevant.
 * @property {bigint} lastUpdatedAt - The UNIX timestamp (in milliseconds) for when this balance was fetched.
 */
interface Balance {
  amount: bigint;
  block: bigint;
  lastUpdatedAt: bigint;
}

export default Balance;
