// import { isEqual } from '@agoralabs-sh/bytes';
// import { generate } from '@agoralabs-sh/uuid';
// import { randomBytes } from '@noble/hashes/utils';
// import { encode as encodeHex } from '@stablelib/hex';
// import { deleteDB } from 'idb';
// import { afterEach, beforeEach, describe, expect, test } from 'vitest';
//
// // constants
// import { INITIALIZATION_VECTOR_BYTE_SIZE, SALT_BYTE_SIZE } from '@/constants';
//
// // decorators
// import AccountsVaultDecorator from './AccountsVaultDecorator';
//
// // types
// import { AccountWithKeyData, Passkey, UserInformation } from '@/types';
//
// // utilities
// import { addressFromPrivateKey, createLogger, generatePrivateKey } from '@/utilities';
//
// describe(AccountsVaultDecorator.displayName, () => {
//   const logger = createLogger('silent');
//   const user: UserInformation = {
//     username: 'magnetartare',
//   };
//   let vault: AccountsVaultDecorator;
//
//   afterEach(() => {
//     vault.close();
//   });
//
//   beforeEach(async () => {
//     if (vault) {
//       await deleteDB(vault.name());
//     }
//
//     vault = await AccountsVaultDecorator.create({
//       logger,
//       user,
//     });
//   });
//
//   describe('setPasskey()', () => {
//     test('it should set a new passkey', async () => {
//       const passkey: Passkey = {
//         credentialID: generate(),
//         salt: encodeHex(randomBytes(SALT_BYTE_SIZE)),
//         initializationVector: encodeHex(randomBytes(INITIALIZATION_VECTOR_BYTE_SIZE)),
//         transports: [],
//       };
//       let _passkey: Passkey | null;
//
//       await vault.setPasskey(passkey);
//
//       _passkey = await vault.passkey();
//
//       expect(_passkey).toEqual(passkey);
//     });
//
//     test('it replace an existing passkey', async () => {
//       const passkey: Passkey = {
//         credentialID: generate(),
//         salt: encodeHex(randomBytes(SALT_BYTE_SIZE)),
//         initializationVector: encodeHex(randomBytes(INITIALIZATION_VECTOR_BYTE_SIZE)),
//         transports: [],
//       };
//       let _passkey: Passkey | null;
//
//       await vault.setPasskey({
//         credentialID: generate(),
//         salt: encodeHex(randomBytes(SALT_BYTE_SIZE)),
//         initializationVector: encodeHex(randomBytes(INITIALIZATION_VECTOR_BYTE_SIZE)),
//         transports: [],
//       });
//       await vault.setPasskey(passkey);
//
//       _passkey = await vault.passkey();
//
//       expect(_passkey).toEqual(passkey);
//     });
//   });
//
//   describe('removeItems()', () => {
//     test('it should remove an account', async () => {
//       const privateKey = generatePrivateKey();
//       const address = addressFromPrivateKey(privateKey);
//       let items: Map<string, AccountWithKeyData>;
//       let result: string[];
//
//       await vault.upsert(new Map<string, AccountWithKeyData>([[address, { keyData: privateKey }]]));
//
//       items = await vault.items();
//
//       expect(items.size).toBe(1);
//
//       result = await vault.remove([address]);
//       items = await vault.items();
//
//       expect(result).toEqual([address]);
//       expect(items.size).toBe(0);
//     });
//
//     test('it should remove multiple account', async () => {
//       const privateKey1 = generatePrivateKey();
//       const privateKey2 = generatePrivateKey();
//       const address1 = addressFromPrivateKey(privateKey1);
//       const address2 = addressFromPrivateKey(privateKey2);
//       let items: Map<string, AccountWithKeyData>;
//       let result: string[];
//
//       await vault.upsert(
//         new Map<string, AccountWithKeyData>([
//           [address1, { keyData: privateKey1 }],
//           [address2, { keyData: privateKey2 }],
//         ])
//       );
//
//       result = await vault.remove([address1, address2]);
//       items = await vault.items();
//
//       expect(result).toEqual([address1, address2]);
//       expect(items.size).toBe(0);
//     });
//
//     test('it should remove an account with existing accounts', async () => {
//       const privateKey = generatePrivateKey();
//       const removedPrivateKey = generatePrivateKey();
//       const address = addressFromPrivateKey(removedPrivateKey);
//       let items: Map<string, AccountWithKeyData>;
//       let result: string[];
//
//       await vault.upsert(
//         new Map<string, AccountWithKeyData>([
//           [addressFromPrivateKey(privateKey), { keyData: privateKey }],
//           [address, { keyData: removedPrivateKey }],
//         ])
//       );
//
//       items = await vault.items();
//
//       expect(items.size).toBe(2);
//
//       result = await vault.remove([address]);
//       items = await vault.items();
//
//       expect(result).toEqual([address]);
//       expect(items.size).toBe(1);
//     });
//
//     test('it should not remove any accounts account does not exist', async () => {
//       const privateKey = generatePrivateKey();
//       const address = addressFromPrivateKey(generatePrivateKey());
//       let items: Map<string, AccountWithKeyData>;
//       let result: string[];
//
//       await vault.upsert(
//         new Map<string, AccountWithKeyData>([[addressFromPrivateKey(privateKey), { keyData: privateKey }]])
//       );
//
//       result = await vault.remove([address]);
//       items = await vault.items();
//
//       expect(result.length).toBe(0);
//       expect(items.size).toBe(1);
//     });
//   });
//
//   describe('upsertItem()', () => {
//     test('it should add the new item', async () => {
//       const item: AccountWithKeyData = {
//         keyData: generatePrivateKey(),
//         name: 'Personal',
//       };
//       let _item: AccountWithKeyData | null;
//       let items = await vault.items();
//
//       expect(items.size).toBe(0);
//
//       await vault.upsert(new Map<string, AccountWithKeyData>([[addressFromPrivateKey(item.keyData), item]]));
//
//       items = await vault.items();
//       _item = items.get(addressFromPrivateKey(item.keyData)) || null;
//
//       expect(_item).toBeDefined();
//       expect(isEqual(_item?.keyData ?? new Uint8Array(), item.keyData)).toBe(true);
//       expect(_item?.name).toBe(item.name);
//     });
//
//     test('it should update an existing item', async () => {
//       const item: AccountWithKeyData = {
//         keyData: generatePrivateKey(),
//         name: 'Personal',
//       };
//       let _item: AccountWithKeyData | null;
//       let items: Map<string, AccountWithKeyData>;
//
//       await vault.upsert(
//         new Map<string, AccountWithKeyData>([
//           [
//             addressFromPrivateKey(item.keyData),
//             {
//               ...item,
//               name: 'Old Personal',
//             },
//           ],
//         ])
//       );
//
//       items = await vault.items();
//
//       expect(items.size).toBe(1);
//
//       await vault.upsert(new Map<string, AccountWithKeyData>([[addressFromPrivateKey(item.keyData), item]]));
//
//       items = await vault.items();
//       _item = items.get(addressFromPrivateKey(item.keyData)) || null;
//
//       expect(_item).toBeDefined();
//       expect(isEqual(_item?.keyData ?? new Uint8Array(), item.keyData)).toBe(true);
//       expect(_item?.name).toBe(item.name);
//     });
//   });
// });
