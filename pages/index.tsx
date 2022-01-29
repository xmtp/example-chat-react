import type { NextPage } from "next";
import { useEffect, useState } from "react";
// import Head from 'next/head'
// import Image from 'next/image'
// import styles from '../styles/Home.module.css'
import { Client, PrivateKeyBundle, Message } from "xmtp-js";
import * as ethers from "ethers";

const localNodeBootstrapAddr =
  "/ip4/127.0.0.1/tcp/9001/ws/p2p/16Uiu2HAmNCxLZCkXNbpVPBpSSnHj9iq4HZQj7fxRzw2kj1kKSHHA";

// const testnetBootstrapAddr =
//   '/dns4/bootstrap-node-0.testnet.xmtp.network/tcp/8443/wss/p2p/16Uiu2HAm888gVYpr4cZQ4qhEendQW6oYEhG8n6fnqw1jVW3Prdc6'

const Home: NextPage = () => {
  const [client, setClient] = useState<Client>();
  const [user, setUser] = useState<PrivateKeyBundle>();
  const [sender, setOtherUser] = useState<PrivateKeyBundle>();
  const [messages, setMessages] = useState<Message[]>();
  const [wallet, setWallet] = useState<ethers.Wallet>();
  const [senderWallet, setSenderWallet] = useState<ethers.Wallet>();

  useEffect(() => {
    const createUser = async () => {
      const user = await PrivateKeyBundle.generate();
      setUser(user);

      if (!user?.identityKey?.secp256k1?.bytes) return;
      const wallet = new ethers.Wallet(user.identityKey.secp256k1.bytes);
      await user.identityKey.publicKey.signWithWallet(wallet);
      setWallet(wallet);
    };
    createUser();

    const createSender = async () => {
      const sender = await PrivateKeyBundle.generate();
      setOtherUser(sender);

      if (!sender?.identityKey?.secp256k1?.bytes) return;
      const wallet = new ethers.Wallet(sender.identityKey.secp256k1.bytes);
      await sender.identityKey.publicKey.signWithWallet(wallet);
      setSenderWallet(wallet);
    };
    createSender();
  }, []);

  useEffect(() => {
    const createClient = async () => {
      const client = await Client.create({
        bootstrapAddrs: [localNodeBootstrapAddr],
      });
      setClient(client);

      if (!client || !user) return;
      const stream = client.streamMessages(user);
      // for await (const msg of stream.iterator) {
      //   console.log('msg', msg)
      //   setMessages(messages => [...messages || [], msg])
      // }
      const msg = await stream.next();
      setMessages([msg]);
    };
    createClient();
  }, [user]);

  useEffect(() => {
    const sendMessage = async () => {
      if (!client || !user || !sender) return;
      await client.sendMessage(sender, user.getPublicKeyBundle(), "hi");
    };
    sendMessage();
  }, [client, user, sender]);

  // const handleSend = async (e: React.SyntheticEvent) => {
  //   e.preventDefault()
  //   if (!client || !user) return

  //   const data = e.target as typeof e.target & {
  //     recipient: { value: string }
  //   }
  //   console.log(data.recipient.value)
  //   // const recipient = PublicKeyBundle.fromBytes(hexToBytes(data.recipient.value))
  //   const recipient = user.publicKeyBundle
  //   console.log('Recipient:', recipient.identityKey?.getEthereumAddress())

  //   await client.sendMessage(user, user.publicKeyBundle, 'hi')
  //   await client.sendMessage(user, recipient, 'hi')
  // }

  return (
    <div>
      {/* <pre>{client && JSON.stringify(client.waku.relay.getPeers())}</pre> */}
      <pre>
        You: {user?.getPublicKeyBundle().identityKey?.getEthereumAddress()}
      </pre>
      <pre>You wallet: {wallet?.address}</pre>
      <pre>
        Sender: {sender?.getPublicKeyBundle().identityKey?.getEthereumAddress()}
      </pre>
      <pre>Sender wallet: {senderWallet?.address}</pre>
      {/* <pre>You (identityKey): {JSON.stringify(user?.publicKeyBundle.identityKey, null, 2)}</pre>
      <pre>You (preKey): {JSON.stringify(user?.publicKeyBundle.preKey, null, 2)}</pre> */}
      {/* <form onSubmit={handleSend}>
        <label>Recipient: </label>
        <input name="recipient" style={{ width: '100%' }} />
        <button type="submit">Send</button>
      </form> */}
      <pre>{messages && messages.map((msg: Message) => msg.decrypted)}</pre>
    </div>
  );
};

export default Home;
