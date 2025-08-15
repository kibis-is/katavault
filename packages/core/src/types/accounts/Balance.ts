/**
 * @property {string} amount - An integer representing the balance of the atomic unit.
 * @property {string} block - The block for which this balance is relevant.
 * @property {string} lastUpdatedAt - The UNIX timestamp (in milliseconds) for when this balance was fetched.
 */
interface Balance {
  amount: string;
  block: string;
  lastUpdatedAt: string;
}

export default Balance;
