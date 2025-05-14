interface BaseAuthenticationStore {
  decryptBytes(encryptedBytes: Uint8Array): Promise<Uint8Array>;
  encryptBytes(bytes: Uint8Array): Promise<Uint8Array>;
}

export default BaseAuthenticationStore;
