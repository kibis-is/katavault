<div align="center">

[![License: CC0-1.0](https://img.shields.io/badge/License-CC0_1.0-brightgreen.svg)](LICENSE)
[![NPM Version](https://img.shields.io/npm/v/%40kibisis%2Fembedded-wallet-sdk)](https://www.npmjs.com/package/%40kibisis/embedded-wallet-sdk)

</div>

<div align="center">

![GitHub Release](https://img.shields.io/github/v/release/kibis-is/embedded-wallet-sdk?filter=%40kibis-is%2Fembedded-wallet-sdk*)
![GitHub Release](https://img.shields.io/github/v/release/kibis-is/embedded-wallet-sdk?include_prereleases&filter=%40kibis-is%2Fembedded-wallet-sdk*&label=pre-release)

</div>

<h1 align="center">
  @kibisis/embedded-wallet-sdk
</h1>

<p align="center">
  The core implementation for the embedded wallet SDK.
</p>

---

### Table of contents

* [1. Getting started](#-1-getting-started)
  - [1.1. Installation](#11-installation)
* [2. Documentation](#-2-documentation)
* [3. Development](#-3-development)
  - [3.1. Requirements](#31-requirements)
  - [3.2. Setup](#32-setup)
  - [3.3. Running the example](#33-running-the-example)
* [4. Appendix](#-4-appendix)
  - [4.1. Useful commands](#41-useful-commands)
* [5. How to contribute](#-5-how-to-contribute)
* [6. License](#-6-license)

## 🪄 1. Getting Started

### 1.1. Installation

You can install using:
```shell
npm install @kibisis/embedded-wallet-sdk
```

<sup>[Back to top ^][table-of-contents]</sup>

## 📚 2. Documentation

For full documentation on usage, see [here](https://kibis-is.github.io/embedded-wallet-sdk/usage/core).

<sup>[Back to top ^][table-of-contents]</sup>

## 🛠 3. Development

### 3.1. Requirements

* Install [Node v20.18.0+](https://nodejs.org/en/)
* Install [pnpm v10.13.0](https://pnpm.io/installation)

<sup>[Back to top ^][table-of-contents]</sup>

### 3.2. Setup

1. Install the dependencies:
```bash
$ pnpm install
```

### 3.3. Running the example

The example can be run by using:

```shell
pnpm -F @kibisis/embedded-wallet-sdk start
```

This will build a local copy of the SDK and start a development server running the example code in [`example/`](./example).

The example site will be running on [http://localhost:8080](http://localhost:8080).

<sup>[Back to top ^][table-of-contents]</sup>

## 📑 4. Appendix

### 4.1. Useful Commands

| Command               | Description                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| `pnpm build`          | Generates build and TypeScript declaration files to the `dist/` directory.  |
| `pnpm clean`          | Deletes the `dist/` directory and the `tsconfig.*.tsbuildinfo` files.       |
| `pnpm generate:index` | Generates/overwrites the main `index.ts` file used for exporting all files. |
| `pnpm lint`           | Runs the linter based on the rules in `eslint.config.mjs`.                  |
| `pnpm prettier`       | Runs the prettier based on the rules in `prettier.config.mjs`.              |
| `pnpm test`           | Runs Vitest.                                                                |

<sup>[Back to top ^][table-of-contents]</sup>

## 👏 5. How to contribute

Please read the [**contributing guide**](https://github.com/kibis-is/embedded-wallet-sdk/blob/main/CONTRIBUTING.md) to learn about the development process.

<sup>[Back to top ^][table-of-contents]</sup>

## 📄 6. License

Please refer to the [LICENSE][license] file.

<sup>[Back to top ^][table-of-contents]</sup>

<!-- links -->
[license]: LICENSE
[table-of-contents]: #table-of-contents

