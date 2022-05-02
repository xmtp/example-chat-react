# React Chat Example

![Test](https://github.com/xmtp/example-chat-react/actions/workflows/test.yml/badge.svg)
![Lint](https://github.com/xmtp/example-chat-react/actions/workflows/lint.yml/badge.svg)
![Build](https://github.com/xmtp/example-chat-react/actions/workflows/build.yml/badge.svg)

![x-red-sm](https://user-images.githubusercontent.com/510695/163488403-1fb37e86-c673-4b48-954e-8460ae4d4b05.png)

**This example chat application demonstrates the core concepts and capabilities of the XMTP Client SDK.** It is built with React, [Next.js](https://nextjs.org/), and the [`xmtp-js`](https://github.com/xmtp/xmtp-js) client library. The application is capable of sending and receiving messages via the [XMTP Labs](https://xmtp.com) development network, with no performance guarantees and [notable limitations](#limitations) to its functionality.

It is maintained by [XMTP Labs](https://xmtp.com) and distributed under [MIT License](./LICENSE) for learning about and developing applications that utilize the XMTP decentralized communication protocol.

**All wallets and messages are forcibly deleted from the development network on Mondays.**

## Disclaimer

The XMTP protocol is in the early stages of development. This software is being provided for evaluation, feedback, and community contribution. It has not undergone a formal security audit and is not intended for production applications. Significant breaking revisions should be expected.

## Getting Started

### Configure Infura

Add your Infura ID to `.env.local` in the project's root.

```
NEXT_PUBLIC_INFURA_ID={YOUR_INFURA_ID}
```

If you do not have an Infura ID, you can follow [these instructions](https://blog.infura.io/getting-started-with-infura-28e41844cc89/) to get one.

_This example comes preconfigured with an Infura ID provided for demonstration purposes. If you plan to fork or host it, you must use your own Infura ID as detailed above._

### Install the package

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Functionality

### Wallet Connections

[`Web3Modal`](https://github.com/Web3Modal/web3modal) is used to inject a Metamask, Coinbase Wallet, or WalletConnect provider through [`ethers`](https://docs.ethers.io/v5/). Methods for connecting and disconnecting are included in **WalletContext** alongside the provider, signer, wallet address, and ENS utilities.

In order to use the application's chat functionality, the connected wallet must provide two signatures:

1. A one-time signature that is used to generate the wallet's private XMTP identity
2. A signature that is used on application start-up to initialize the XMTP client with that identity

### Chat Conversations

The application utilizes the `xmtp-js` [Conversations](https://github.com/xmtp/xmtp-js#conversations) abstraction to list the available conversations for a connected wallet and to listen for or create new conversations. For each convesation, it gets existing messages and listens for or creates new messages. Conversations and messages are kept in a lightweight store and made available through **XmtpContext** alongside the client and its methods.

### Limitations

The application's functionality is limited by current work-in-progress on the `xmtp-js` client.

#### Messages cannot yet be directed to wallets that have not used XMTP

The client will throw an error when attempting to lookup an address that does not have an identity broadcast on the XMTP network.

This limitation will be mitigated very soon by the example application's UI, and resolved soon via improvements to the `xmtp-js` library that will allow messages to be created even if the intended recipient has not yet generated its keys.
