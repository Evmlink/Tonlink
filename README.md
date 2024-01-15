# TonLink Npm

This repo is to build a browser base light wallet for TON blockchain

It will allows anyone to send some `Cash Gift` by TON blockchain

You can visit [npm](https://www.npmjs.com/settings/tonlink/members).

## Feature

- Use `tonweb`` to make pair generate in EVM chain .

- Add TON txns to make  simple transactions .

- Generate new link (which allows to be paid) . 

# What is TonLink?

TonLink is a lightweight wallet designed to make TON blockchian assets transfer as easy as sending a link. It allows any web3auth/unipass/magicWallet user to easly transfer money and share any kinds of token including NFT easly by linkes . 

# Basic Installation instructions
```bash
npm install @tonlink/api
```
Import Instructions
```js
import { TonLink } from '@tonlink';
```
Create a TonLink
```js
const ton = TonLink.create("http://localhost/");
```
Recover from a link
```js
const ton = TonLink.create("http://localhost/");
```