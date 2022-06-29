# React Chat Example

![Test](https://github.com/xmtp/example-chat-react/actions/workflows/test.yml/badge.svg)
![Lint](https://github.com/xmtp/example-chat-react/actions/workflows/lint.yml/badge.svg)
![Build](https://github.com/xmtp/example-chat-react/actions/workflows/build.yml/badge.svg)

![x-red-sm](https://user-images.githubusercontent.com/510695/163488403-1fb37e86-c673-4b48-954e-8460ae4d4b05.png)

**Example chat application demonstrating the core concepts and capabilities of the XMTP client SDK**

This application is built with React, [Next.js](https://nextjs.org/), and the [`xmtp-js` client SDK](https://github.com/xmtp/xmtp-js).

The application sends and receives messages using the XMTP `dev` network environment, with some **[notable limitations](#limitations)**.

This application is maintained by [XMTP Labs](https://xmtp.com) and distributed under [MIT License](./LICENSE) for learning about and developing applications built with XMTP, a messaging protocol and decentralized communication network for blockchain wallets.

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

To use the application's chat functionality, the connected wallet must provide two signatures:

1. A one-time signature that is used to generate the wallet's private XMTP identity
2. A signature that is used on application start-up to initialize the XMTP client with that identity

### Chat Conversations

The application uses the `xmtp-js` [Conversations](https://github.com/xmtp/xmtp-js#conversations) abstraction to list the available conversations for a connected wallet and to listen for or create new conversations. For each conversation, the application gets existing messages and listens for or creates new messages. Conversations and messages are kept in a lightweight store and made available through **XmtpContext** alongside the client and its methods.

### Limitations

Here are important limitations to understand when working with the example chat application:

- The application hasn't undergone a formal security audit.
- The application sends and receives messages using the XMTP `dev` network environment.
     - **DO NOT** send sensitive information on the `dev` network.
     - XMTP does not regularly delete messages and keys from the `dev` network. However, because XMTP is still in active development, we might need to delete messages and keys occasionally to maintain network stability. XMTP communicates about deletions in the XMTP Discord community ([request access](https://xmtp.typeform.com/to/yojTJarb?utm_source=docs_home)), providing as much advance notice as possible.
- You can't yet send a message to a wallet address that hasn't used XMTP. The client displays an error when it looks up an address that doesn't have an identity broadcast on the XMTP network.
   - This limitation will soon be communicated more clearly in the application UI.
   - This limitation will soon be resolved by improvements to the `xmtp-js` library that will allow messages to be created and stored for future delivery, even if the recipient hasn't used XMTP yet.
