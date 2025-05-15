<h1 align="center">
  Katavault
</h1>

<p align="center">
  A TypeScript/JavaScript SDK that allows dApps to securely embed wallets using IndexedDB and leveraging WebAuthn for private key encryption.
</p>

---

### Table of contents

* [1. Overview](#-1-overview)
* [2. Documentation](#-2-documentation)
* [3. Appendix](#-3-appendix)
  - [3.1. Packages](#31-packages)
* [4. How to contribute](#-4-how-to-contribute)

## 🔭 1. Overview

Blockchain technology has revolutionized the way we think about digital ownership, security, and decentralized applications (dApps). However, one of the persistent challenges in onboarding users to blockchain-based platforms is the complexity associated with interacting with wallets and signing operations. Traditional wallet solutions often rely on third-party applications or browser extensions, which introduce friction into the user experience. These complexities can deter mainstream adoption and limit the accessibility of dApps.

### Key challenges

* Signing transactions and managing private keys through external wallets can be intimidating for users unfamiliar with blockchain technology.
* Switching between a dApp and a third-party wallet disrupts the flow of interaction, making the experience cumbersome.
* Relying on third-party wallets requires users to install additional software or extensions, adding barriers to entry.
* Compatibility issues between wallets and dApps can lead to frustration and limit functionality.
* Users often need to understand blockchain concepts such as gas fees, network selection, and transaction confirmations to interact with dApps effectively.
* The blockchain knowledge requirement alienates non-technical users who might otherwise benefit from the application.

### Approach

Katavault empowers dApps to embed a secure wallet directly within their website, streamlining blockchain interactions and delivering a seamless user experience by abstracting away underlying complexities.

While embedding a wallet in a website introduces concerns about the safety of sensitive data, Katavault addresses these challenges by leveraging the latest advancements in web security technology.

A key innovation is the use of [Web Authentication](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API) (WebAuthn). WebAuthn enables the wallet to interact with a user’s passkey through the browser’s native UI, supporting a wide range of authentication methods-from Windows Hello on PCs, to biometrics like fingerprint or FaceID on mobile devices, and even hardware security keys such as Yubikey.

Katavault utilizes the [PRF extension](https://github.com/w3c/webauthn/wiki/Explainer:-PRF-extension) of WebAuthn to deterministically derive encryption key material from the user’s passkey. This key is then used to encrypt the wallet’s private keys using AES-GCM, ensuring robust protection.

For users who prefer or require a more traditional approach, Katavault also supports password-based encryption. In this mode, a user’s password is transformed into a strong cryptographic key using PBKDF2, and private keys are encrypted using the XSalsa20-Poly1305 algorithm-a modern, high-security cipher that provides both confidentiality and integrity.

Regardless of the authentication method, all encrypted private keys are securely stored using [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), which offers stronger isolation and security guarantees than alternatives like `localStorage`.

By supporting both passkey-based and password-based encryption, Katavault ensures that users can choose the authentication method that best fits their needs, without compromising on security or usability.

### Why this matters

* Users can interact with the dApp without realizing they are using blockchain technology. They simply use the application as they would any other web app, while the embedded wallet handles all blockchain-related operations in the background. This reduces cognitive load and makes dApps accessible to a broader audience.
* By embedding the wallet within the dApp, users no longer need to switch between applications or extensions. All interactions happen within a single interface. Signing operations are simplified, allowing users to approve actions intuitively without needing to understand technical details.
* Users are not required to install or configure external wallets, lowering barriers to entry.
* Allows developers to focus on creating compelling user experiences while enabling non-technical users to reap the benefits of decentralized applications without needing to understand blockchain mechanics.

In essence, this SDK empowers developers to build dApps that feel like traditional web applications while leveraging the power of blockchain behind the scenes — making decentralization truly invisible yet impactful for end-users.

<sup>[Back to top ^][table-of-contents]</sup>

## 📚 2. Documentation

For full documentation on usage, see [here](https://kibis-is.github.io/katavault).

<sup>[Back to top ^][table-of-contents]</sup>

## 📑 3. Appendix

### 3.1. Packages

| Name                                                                                                   | Description                             | Package                                                                                                                               |
|--------------------------------------------------------------------------------------------------------|-----------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| [`@kibisis/katavault-core`](https://github.com/kibis-is/katavault/blob/main/packages/core/README.md)   | The core implementation for Katavault.  | [![NPM Version](https://img.shields.io/npm/v/%40kibisis%2Fkatavault-core)](https://www.npmjs.com/package/%40kibisis/katavault-core)   |
| [`@kibisis/katavault-react`](https://github.com/kibis-is/katavault/blob/main/packages/react/README.md) | The React implementation for Katavault. | [![NPM Version](https://img.shields.io/npm/v/%40kibisis%2Fkatavault-react)](https://www.npmjs.com/package/%40kibisis/katavault-react) |

<sup>[Back to top ^][table-of-contents]</sup>

## 👏 4. How to contribute

Please read the [**contributing guide**](https://github.com/kibis-is/katavault/blob/main/CONTRIBUTING.md) to learn about the development process.

<sup>[Back to top ^][table-of-contents]</sup>

<!-- links -->
[table-of-contents]: #table-of-contents
