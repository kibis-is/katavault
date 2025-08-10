import { base58, base64, utf8 } from '@kibisis/encoding';
import { sha512 } from '@noble/hashes/sha512';

// enums
import { AuthenticationMethodEnum } from '@/enums';

// errors
import { AuthenticationMethodNotSupportedError, InvalidCredentialIDError } from '@/errors';

// types
import type { CreateCredentialIDParameters, CredentialIDParameters } from '@/types';

/**
 * The CredentialID is a utility class that manages a credential ID.
 *
 * A credential ID consists of two parts `<method>:<payload>`:
 * * The "method" indicates the authentication method of the credential, which is one of `passkey` or `password`.
 * * The "payload" is a unique representation of the credential and differs depending on the authentication method.
 *
 * The structure of each type credential method is defined as:
 * * Passkeys: `passkey:base58(<SHA-512 of the credential ID>)`
 * * Passwords: `password:base58(<SHA-512 of the password>)`
 */
export default class CredentialID {
  /**
   * public static properties
   */
  public static displayName = 'CredentialID';
  public static passkeyCredentialIDPrefix: string = 'passkey';
  public static passwordCredentialIDPrefix: string = 'password';
  /**
   * private properties
   */
  private readonly _method: AuthenticationMethodEnum;
  private readonly _payload: string;

  private constructor({ method, payload }: CredentialIDParameters) {
    this._method = method;
    this._payload = payload;
  }

  /**
   * private static methods
   */

  private static _encodePasskeyPayload(payload: string): string {
    return base58.encode(sha512(base64.decode(payload)));
  }

  private static _encodePasswordPayload(payload: string): string {
    return base58.encode(sha512(utf8.decode(payload)));
  }

  /**
   * public static methods
   */

  /**
   * Generates a credential ID based on the authentication method.
   * * Passkeys: `passkey:base58(<SHA-512 of the credential ID>)`
   * * Passwords: `password:base58(<SHA-512 of the password>)`
   * @param {CredentialIDParameters} params - The parameters containing authentication method and credential details.
   * @return {CredentialID} An initialized instance of the credential ID.
   * @throws {AuthenticationMethodNotSupportedError} If the authentication method is not supported.
   * @public
   * @static
   */
  public static create(params: CreateCredentialIDParameters): CredentialID {
    switch (params.method) {
      case AuthenticationMethodEnum.Passkey:
        return new CredentialID({
          method: AuthenticationMethodEnum.Passkey,
          payload: CredentialID._encodePasskeyPayload(params.passkeyCredentialID),
        });
      case AuthenticationMethodEnum.Password:
        return new CredentialID({
          method: AuthenticationMethodEnum.Password,
          payload: CredentialID._encodePasswordPayload(params.password),
        });
      default:
        throw new AuthenticationMethodNotSupportedError(`invalid authentication method`);
    }
  }

  /**
   * Initializes a credential ID from a credential ID string, i.e. `<method>:<payload>`.
   *
   * @param {string} credentialID - The stringified credential ID.
   * @returns {CredentialID} An initialized CredentialID instance.
   * @throws {InvalidCredentialIDError} If the credential ID is not valid.
   * @public
   * @static
   */
  public static fromString(credentialID: string): CredentialID {
    const [method, payload] = credentialID.split(':');

    switch (method) {
      case CredentialID.passkeyCredentialIDPrefix:
        return new CredentialID({
          method: AuthenticationMethodEnum.Passkey,
          payload,
        });
      case CredentialID.passwordCredentialIDPrefix:
        return new CredentialID({
          method: AuthenticationMethodEnum.Password,
          payload,
        });
      default:
        throw new InvalidCredentialIDError(`invalid credential id should be in the format "<method>:<payload>"`);
    }
  }

  /**
   * public methods
   */

  /**
   * Retrieves the authentication method.
   *
   * @return {AuthenticationMethodEnum} The authentication method.
   * @public
   */
  public method(): AuthenticationMethodEnum {
    return this._method;
  }

  /**
   * Retrieves the payload.
   *
   * @return {string} The payload.
   * @public
   */
  public payload(): string {
    return this._payload;
  }

  /**
   * Converts the credential ID into a string representation in the format `<method>:<payload>`.
   *
   * @return {string} A string representation of the credential ID.
   * @throws {AuthenticationMethodNotSupportedError} If the authentication method is not supported.
   * @public
   */
  public toString(): string {
    switch (this._method) {
      case AuthenticationMethodEnum.Passkey:
        return `${CredentialID.passkeyCredentialIDPrefix}:${this._payload}`;
      case AuthenticationMethodEnum.Password:
        return `${CredentialID.passwordCredentialIDPrefix}:${this._payload}`;
      default:
        throw new AuthenticationMethodNotSupportedError(`invalid authentication method`);
    }
  }

  /**
   * Verifies the provided claim against the credential ID payload for the credential ID authentication method.
   *
   * For passkeys, this will be the passkey credential ID encoded in base64.
   * For password, this will be the UTF-8 encoded password.
   *
   * @param {string} claim - The claim to be verified.
   * @throws {AuthenticationMethodNotSupportedError} If the authentication method is not supported.
   * @public
   */
  public verify(claim: string): boolean {
    switch (this._method) {
      case AuthenticationMethodEnum.Passkey:
        return this._payload === CredentialID._encodePasskeyPayload(claim);
      case AuthenticationMethodEnum.Password:
        return this._payload === CredentialID._encodePasswordPayload(claim);
      default:
        throw new AuthenticationMethodNotSupportedError(`invalid authentication method`);
    }
  }
}
