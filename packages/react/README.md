<div align="center">

[![License: CC0-1.0](https://img.shields.io/badge/License-CC0_1.0-brightgreen.svg)][license]
[![NPM Version](https://img.shields.io/npm/v/%40kibisis%2Fkatavault-react)](https://www.npmjs.com/package/%40kibisis/katavault-react)

</div>

<div align="center">

[![GitHub Release](https://img.shields.io/github/v/release/kibis-is/katavault?filter=%40kibisis%2Fkatavault-react*)](https://github.com/kibis-is/katavault/releases)
[![GitHub Release](https://img.shields.io/github/v/release/kibis-is/katavault?include_prereleases&filter=%40kibisis%2Fkatavault-react*&label=pre-release)](https://github.com/kibis-is/katavault/releases/latest)

</div>


<div align="center">
  <img alt="Katavault and React logo" src="https://github.com/kibis-is/katavault/blob/main/images/katavault_react_logo@405x128.png" height="64" />
</div>

<h1 align="center">
  @kibisis/katavault-react
</h1>

<p align="center">
  The React implementation for Katavault.
</p>

---

### Table of contents

* [1. Getting started](#-1-getting-started)
  - [1.1. Installation](#11-installation)
* [2. Documentation](#-2-documentation)
* [3. Development](#-3-development)
  - [3.1. Requirements](#31-requirements)
  - [3.2. Setup](#32-setup)
* [4. Appendix](#-4-appendix)
  - [4.1. Useful commands](#41-useful-commands)
* [5. How to contribute](#-5-how-to-contribute)
* [6. License](#-6-license)

## 🪄 1. Getting Started

### 1.1. Installation

First, install the dependencies:

```shell
npm install react@18.x @kibisis/katavault-core
```

Then install the SDK using:
```shell
npm install @kibisis/katavault-react
```

<sup>[Back to top ^][table-of-contents]</sup>

## 📚 2. Documentation

For full documentation on usage, see [here](https://docs.katavault.kibis.is/react/getting-started).

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

Please read the [**contributing guide**](https://github.com/kibis-is/katavault/blob/main/CONTRIBUTING.md) to learn about the development process.

<sup>[Back to top ^][table-of-contents]</sup>

## 📄 6. License

Please refer to the [LICENSE][license] file.

<sup>[Back to top ^][table-of-contents]</sup>

<!-- links -->
[license]: https://github.com/kibis-is/katavault/blob/main/packages/react/LICENSE
[table-of-contents]: #table-of-contents

