/**
 * @property {number} entropy - The password entropy in bits.
 * @property {number} score - The password score based on the entropy.
 *
 */
interface PasswordScoreResult {
  entropy: number;
  score: number;
}

export default PasswordScoreResult;
