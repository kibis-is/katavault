import { base58, base64, utf8 } from '@kibisis/encoding';
import { sha512 } from '@noble/hashes/sha512';
import { randomBytes, randomString } from '@stablelib/random';
import { describe, expect, test } from 'vitest';

// constants
import { INVALID_CREDENTIAL_ID_ERROR } from '@/constants';

// decorators
import CredentialID from './CredentialID';

// enums
import { AuthenticationMethodEnum } from '@/enums';

// errors
import { BaseError } from '@/errors';

describe(CredentialID.displayName, () => {
  const passkeyCredentialID = base64.encode(randomBytes(32));
  const password = randomString(12);

  describe(`create()`, () => {
    test('should create a passkey credential id', () => {
      const method = AuthenticationMethodEnum.Passkey;
      const result = CredentialID.create({
        method,
        passkeyCredentialID,
      });

      expect(result.method()).toBe(method);
    });

    test('should create a password credential id', () => {
      const method = AuthenticationMethodEnum.Password;
      const result = CredentialID.create({
        method,
        password,
      });

      expect(result.method()).toBe(method);
    });
  });

  describe(`fromString()`, () => {
    test('should fail if the credential id is missing the method', () => {
      try {
        CredentialID.fromString(`:${base58.encode(sha512(base64.decode(passkeyCredentialID)))}`);
      } catch (error) {
        expect((error as BaseError).type).toBe(INVALID_CREDENTIAL_ID_ERROR);

        return;
      }

      throw new Error('should throw an invalid credential id error');
    });

    test('should fail if the credential id is missing the payload', () => {
      try {
        CredentialID.fromString(`${AuthenticationMethodEnum.Passkey}:`);
      } catch (error) {
        expect((error as BaseError).type).toBe(INVALID_CREDENTIAL_ID_ERROR);

        return;
      }

      throw new Error('should throw an invalid credential id error');
    });

    test('should fail if the credential id is invalid', () => {
      try {
        CredentialID.fromString(`not a valid credential id`);
      } catch (error) {
        expect((error as BaseError).type).toBe(INVALID_CREDENTIAL_ID_ERROR);

        return;
      }

      throw new Error('should throw an invalid credential id error');
    });

    test('should create a passkey credential id from a string', () => {
      const payload = base58.encode(sha512(base64.decode(passkeyCredentialID)));
      const result = CredentialID.fromString(`${CredentialID.passkeyCredentialIDPrefix}:${payload}`);

      expect(result.method()).toBe(AuthenticationMethodEnum.Passkey);
      expect(result.payload()).toBe(payload);
    });

    test('should create a password credential id from a string', () => {
      const payload = base58.encode(sha512(utf8.decode(password)));
      const result = CredentialID.fromString(`${CredentialID.passwordCredentialIDPrefix}:${payload}`);

      expect(result.method()).toBe(AuthenticationMethodEnum.Password);
      expect(result.payload()).toBe(payload);
    });
  });

  describe.only(`verify()`, () => {
    test('should fail if the passkey claim is invalid', () => {
      const credentialID = CredentialID.create({
        method: AuthenticationMethodEnum.Passkey,
        passkeyCredentialID,
      });

      expect(credentialID.verify(base64.encode(randomBytes(32)))).toBe(false);
    });

    test('should fail if the password claim is invalid', () => {
      const credentialID = CredentialID.create({
        method: AuthenticationMethodEnum.Password,
        password,
      });

      expect(credentialID.verify(randomString(12))).toBe(false);
    });

    test('should verify the passkey claim', () => {
      const credentialID = CredentialID.create({
        method: AuthenticationMethodEnum.Passkey,
        passkeyCredentialID,
      });

      expect(credentialID.verify(passkeyCredentialID)).toBe(true);
    });

    test('should verify the password claim', () => {
      const credentialID = CredentialID.create({
        method: AuthenticationMethodEnum.Password,
        password,
      });

      expect(credentialID.verify(password)).toBe(true);
    });
  });
});
