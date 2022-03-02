# React Chat Example

![Test](https://github.com/xmtp/chat/actions/workflows/test.yml/badge.svg)
![Lint](https://github.com/xmtp/chat/actions/workflows/lint.yml/badge.svg)
![Build](https://github.com/xmtp/chat/actions/workflows/build.yml/badge.svg)

This example chat application demonstrates the core concepts and capabilities of the XMTP Client SDK. It is built with React, [Next.js](https://nextjs.org/), and the [`xmtp-js`](https://github.com/xmtp/xmtp-js) client library. The application is capable of sending and receiving messages through the [XMTP Playnet](https://community.xmtp.org/t/how-decentralized-is-the-xmtp-network/455) environment, with no performance guarantees and [several notable limitations](#limitations) to its functionality.

It is maintained by [XMTP Labs](https://xmtp.com) and distributed under MIT License for learning about and developing applications that utilize the XMTP decentralized communication protocol.

## Disclaimer
The XMTP protocol is in the early stages of development. This software is being provided for evaluation, feedback, and community contribution. It has not undergone a formal security audit and is not intended for production applications. Significant breaking revisions should be expected.

As `@xmtp/xmtp-js` has not yet been published to `npm`, installing this application requires access to the [`xmtp/xmtp-js`](https://github.com/xmtp/xmtp-js) GitHub repo. You may request access [here](https://xmtp.typeform.com/join-waitlist).

## Getting Started

Install:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
next dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Functionality

### Wallet Connections

[`Web3Modal`](https://github.com/Web3Modal/web3modal) is used to inject a Metamask, Coinbase Wallet, or WalletConnect provider through [`ethers`](https://docs.ethers.io/v5/). Methods for connecting and disconnecting are included in **WalletContext** alongside the provider, signer, wallet address, and ENS utilities.

In order to use the application's chat functionality, the connected wallet must provide two signatures:

1. A one-time signature that is used to generate the wallet's private XMTP identity
2. A signature that is used to initialize the XMTP client with that identity

### Chat Conversations

The application utilizes the `xmtp-js` [Conversations](https://github.com/xmtp/xmtp-js#conversations) abstraction to list the available conversations for a connected wallet and to listen for or create new conversations. For each convesation, it gets existing messages and listens for or creates new messages. Conversations and messages are kept in a lightweight store and made available through **XmtpContext** alongside the client and its methods.

### Limitations

The application's functionality is limited in two major ways by current work-in-progress on the `xmtp-js` client.

#### Wallets cannot be used with multiple browsers

The client stores the wallet's private identity in the browser's local storage. New browsers or incognito sessions will not have access to this and will create a new identity for the wallet. Once multiple identities are broadcast to the network, past messages cannot be retrieved, and neither message receipt or delivery can be guaranteed.

#### Messages cannot be directed to wallets that have not used XMTP

The client will throw an error when attempting to lookup an address that does not have an identity broadcast on the XMTP network. This will be addressed very soon in the example application's UI, and soon via improvements to the `xmtp-js` library that will allow encrypted messages to be created even if the recipient wallet has not yet created its keys.
