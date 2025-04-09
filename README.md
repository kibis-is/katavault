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

Katavault attempts to enable dApps to embed a wallet directly within their website which addresses some of the aforementioned challenges by abstracting away blockchain complexities and providing a seamless user experience.

A glaring problem with embedded wallets is that a website is not really a safe place for sensitive data. However, the embedded wallet takes advantage of some of the latest emerging technologies available on the web.

One of these exciting technologies is [Web Authentication](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API) (also known as WebAuthn). This technology leverages the native browser's internal UI to interact with a user's passkey, which can take any number of forms: from Windows Hello on PCs, to biometrics (fingerprint/FaceID) on Android/iOS devices, to physical USB security keys such as Yubikey.

Katavault uses the [PRF extension](https://github.com/w3c/webauthn/wiki/Explainer:-PRF-extension) of WebAuthn to extract deterministic encryption key material that can be used to derive an encryption key. This derived encryption key can then apply [AES-GCM](https://csrc.nist.rip/groups/ST/toolkit/BCM/documents/proposedmodes/gcm/gcm-spec.pdf) encryption to the wallet's private keys.

These encrypted private keys are then stored using [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), as opposed to `localStorage`, due to the latter being less secure than IndexedDB.

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

| Name                                                     | Description                             | Package                                                                                                                               |
|----------------------------------------------------------|-----------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| [`@kibisis/katavault-core`](./packages/core/README.md)   | The core implementation for Katavault.  | [![NPM Version](https://img.shields.io/npm/v/%40kibisis%2Fkatavault-core)](https://www.npmjs.com/package/%40kibisis/katavault-core)   |
| [`@kibisis/katavault-react`](./packages/react/README.md) | The React implementation for Katavault. | [![NPM Version](https://img.shields.io/npm/v/%40kibisis%2Fkatavault-react)](https://www.npmjs.com/package/%40kibisis/katavault-react) |

<sup>[Back to top ^][table-of-contents]</sup>

## 👏 4. How to contribute

Please read the [**contributing guide**](https://github.com/kibis-is/katavault/blob/main/CONTRIBUTING.md) to learn about the development process.

<sup>[Back to top ^][table-of-contents]</sup>

<!-- links -->
[contribute]: ../../CONTRIBUTING.md
[table-of-contents]: #table-of-contents

