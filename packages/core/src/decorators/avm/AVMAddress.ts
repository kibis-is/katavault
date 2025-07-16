import { concat } from '@agoralabs-sh/bytes';
import { sha512_256 } from '@noble/hashes/sha512';
import { encodeBase32UpperCaseNoPadding, decodeBase32IgnorePadding } from '@oslojs/encoding';

// errors
import { InvalidAVMAddressError } from '@/errors';

/**
 * The AVMAddress is a utility decorator that allows easy encoding/decoding of an AVM address.
 *
 * An AVM address is derived from an AVM account's Ed25519 public key; the address is the public key, concatenated with
 * the last 4-bytes of a SHA 512/256 hash of the public key and encoded using base32 (with padding removed and in
 * uppercase).
 *
 * @see {@link https://developer.algorand.org/docs/get-details/accounts/}
 */
export default class AVMAddress {
  // public static variables
  public static addressByteLength = 36;
  public static checksumByteLength = 4;
  public static displayName = 'AVMAddress';
  // private variables
  private readonly _publicKey: Uint8Array;

  private constructor(publicKey: Uint8Array) {
    this._publicKey = publicKey;
  }

  /**
   * public static methods
   */

  /**
   * Initializes the AVMAddress instance from an AVM address.
   * @param {string} address - An AVM address.
   * @returns {AVMAddress} An initialized AVMAddress instance.
   * @throws {InvalidAVMAddressError} If the supplied address is not a valid AVM address.
   */
  public static fromAddress(address: string): AVMAddress {
    let decodedAddress: Uint8Array;

    try {
      decodedAddress = decodeBase32IgnorePadding(address);
    } catch (error) {
      throw new InvalidAVMAddressError(`invalid address: ${error.message}`);
    }

    if (decodedAddress.length !== AVMAddress.addressByteLength) {
      throw new InvalidAVMAddressError(
        `expected a byte length of "${AVMAddress.addressByteLength}" but got "${decodedAddress.length}"`
      );
    }

    return new AVMAddress(decodedAddress.slice(0, AVMAddress.addressByteLength - AVMAddress.checksumByteLength));
  }

  /**
   * Initializes the AVMAddress instance from a public key.
   * @param {Uint8Array} publicKey - A public key.
   * @returns {AVMAddress} An initialized AVMAddress instance.
   */
  public static fromPublicKey(publicKey: Uint8Array): AVMAddress {
    return new AVMAddress(publicKey);
  }

  /**
   * Validates whether a given AVM address is valid.
   * @param {string} address - The address to validate.
   * @returns {boolean} Returns true if the address is valid, otherwise false.
   * @public
   * @static
   */
  public static isValid(address: string): boolean {
    try {
      const decodedAddress = decodeBase32IgnorePadding(address);

      return decodedAddress.length === AVMAddress.addressByteLength;
    } catch (_) {
      return false;
    }
  }

  /**
   * Generates and returns a zeroed-out AVM address.
   * @returns {string} A zeroed-out AVM address.
   * @public
   * @static
   */
  public static zeroAddress(): string {
    return encodeBase32UpperCaseNoPadding(new Uint8Array(AVMAddress.addressByteLength + AVMAddress.checksumByteLength));
  }

  /**
   * public methods
   */

  /**
   * Gets the AVM address.
   * @returns {string} The encoded address as a string.
   * @public
   */
  public address(): string {
    return encodeBase32UpperCaseNoPadding(concat(this._publicKey, this.checksum()));
  }

  /**
   * Gets the checksum of the AVM address. The checksum is the last 4 bytes of the SHA 512/256 hash of the public key.
   * @returns {Uint8Array} The last 4 bytes of the SHA 512/256 hash of the public key.
   * @public
   */
  public checksum(): Uint8Array {
    const hash = sha512_256(this._publicKey);

    return hash.slice(hash.length - AVMAddress.checksumByteLength);
  }

  /**
   * The public key of the AVM address.
   * @returns {Uint8Array} The public key of the AVM address.
   * @public
   */
  public publicKey(): Uint8Array {
    return this._publicKey;
  }
}
