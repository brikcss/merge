# Deep Merge

[![Greenkeeper badge](https://badges.greenkeeper.io/brikcss/merge.svg)](https://greenkeeper.io/)

> Utility to perform a deep merge of a list of objects or arrays.

<!-- Shields. -->
<p>
	<!-- NPM version. -->
	<a href="https://www.npmjs.com/package/@brikcss/merge">
		<img alt="NPM version" src="https://img.shields.io/npm/v/@brikcss/merge.svg?style=flat-square">
	</a>
	<!-- NPM downloads/month. -->
	<a href="https://www.npmjs.com/package/@brikcss/merge">
		<img alt="NPM downloads per month" src="https://img.shields.io/npm/dm/@brikcss/merge.svg?style=flat-square">
	</a>
	<!-- Travis branch. -->
	<a href="https://github.com/brikcss/merge/tree/master">
		<img alt="Travis branch" src="https://img.shields.io/travis/rust-lang/rust/master.svg?style=flat-square&label=master">
	</a>
	<!-- Codacy. -->
	<a href="https://www.codacy.com/app/thezimmee/merge">
		<img alt="NPM version" src="https://img.shields.io/codacy/grade/49af7ce4215c4720a6dbc90c3b7fcdbe/master.svg?style=flat-square">
	</a>
	<!-- Coveralls -->
	<a href='https://coveralls.io/github/brikcss/merge?branch=master'>
		<img src='https://img.shields.io/coveralls/github/brikcss/merge/master.svg?style=flat-square' alt='Coverage Status' />
	</a>
	<!-- Commitizen friendly. -->
	<a href="http://commitizen.github.io/cz-cli/">
		<img alt="Commitizen friendly" src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square">
	</a>
	<!-- Semantic release. -->
	<a href="https://github.com/semantic-release/semantic-release">
		<img alt="semantic release" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square">
	</a>
	<!-- Prettier code style. -->
	<a href="https://prettier.io/">
		<img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square">
	</a>
	<!-- MIT License. -->
	<!-- <a href="https://choosealicense.com/licenses/mit/">
		<img alt="License" src="https://img.shields.io/npm/l/express.svg?style=flat-square">
	</a> -->
</p>

## Install

```sh
npm install @brikcss/merge --save-dev
```

## Usage

Pass list of objects (or arrays) directly to the merge function:

```js
merge(objects...)
```

or pass an array of objects (or arrays) with options:

```js
merge([objects...], options)
```

**_Note: In the browser, merge is attached to the global object `brikcss`, and is accessible via `brikcss.merge()`._

## Options

**`arrayStrategy`** _{String}_ ('unique' | 'concat' | 'overwrite')

- `unique` (default): Concatenate arrays and remove duplicates.
- `concat`: Concatenate arrays, but do not remove duplicates.
- `overwrite`: Overwrite target array with source.

## Environment support

| Node   | CLI   | UMD   | ES Module | Browser   |
|:------:|:-----:|:-----:|:---------:|:---------:|
| ✔      | x     | ✔    | ✔         | ✔         |
