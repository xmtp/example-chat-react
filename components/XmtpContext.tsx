import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { Client, Message } from "@xmtp/xmtp-js";
import { ethers } from "ethers";

// const localNodeBootstrapAddr =
//   "/ip4/127.0.0.1/tcp/9001/ws/p2p/16Uiu2HAmNCxLZCkXNbpVPBpSSnHj9iq4HZQj7fxRzw2kj1kKSHHA";

const testnetBootstrapAddr =
  "/dns4/bootstrap-node-0.testnet.xmtp.network/tcp/8443/wss/p2p/16Uiu2HAm888gVYpr4cZQ4qhEendQW6oYEhG8n6fnqw1jVW3Prdc6";

type Conversation = {
  peerAddress: string;
};

type XmtpContextType = {
  wallet: ethers.Wallet | undefined;
  walletAddress: string | undefined;
  client: Client | undefined;
  conversations: Conversation[];
  connect: (wallet: ethers.Wallet) => void;
  disconnect: () => void;
};

const XmtpContext = createContext<XmtpContextType>({
  wallet: undefined,
  walletAddress: undefined,
  client: undefined,
  conversations: [],
  connect: () => undefined,
  disconnect: () => undefined,
});

export const useXmtp = (): XmtpContextType => {
  const context = useContext(XmtpContext);
  if (context === undefined) {
    throw new Error("useXmtp must be used within an XmtpProvider");
  }
  return context;
};

type XmtpProviderProps = {
  children?: React.ReactNode;
};

export const XmtpProvider = ({ children }: XmtpProviderProps): JSX.Element => {
  const [wallet, setWallet] = useState<ethers.Wallet>();
  const [walletAddress, setWalletAddress] = useState<string>();
  const [client, setClient] = useState<Client>();
  const [conversations, dispatchConversations] = useReducer(
    (state: Conversation[], newConvos: Conversation[] | undefined) => {
      if (newConvos === undefined) {
        return [];
      }
      newConvos = newConvos.filter(
        (convo) =>
          state.findIndex((otherConvo) => {
            return convo.peerAddress === otherConvo.peerAddress;
          }) < 0
      );
      return newConvos === undefined ? [] : state.concat(newConvos);
    },
    []
  );

  const connect = async (wallet: ethers.Wallet) => {
    setWallet(wallet);
    setWalletAddress(await wallet.getAddress());
  };

  const disconnect = async () => {
    setWallet(undefined);
    setWalletAddress(undefined);
    dispatchConversations(undefined);
  };

  useEffect(() => {
    const initClient = async () => {
      if (!wallet) return;
      setClient(
        await Client.create(wallet, {
          bootstrapAddrs: [testnetBootstrapAddr],
        })
      );
    };
    initClient();
  }, [wallet]);

  useEffect(() => {
    const listConversations = async () => {
      if (!client) return;
      const msgs = await client.listIntroductionMessages();
      msgs.forEach((msg: Message) => {
        const recipientAddress = msg.recipientAddress();
        const senderAddress = msg.senderAddress();
        if (!recipientAddress || !senderAddress) return;
        if (recipientAddress === walletAddress) {
          dispatchConversations([{ peerAddress: senderAddress }]);
        } else if (senderAddress == walletAddress) {
          dispatchConversations([{ peerAddress: recipientAddress }]);
        }
      });
    };
    listConversations();
  }, [client, walletAddress]);

  useEffect(() => {
    const streamConversations = async () => {
      if (!client) return;
      const msgs = client.streamIntroductionMessages();
      for await (const msg of msgs) {
        const recipientAddress = msg.recipientAddress();
        const senderAddress = msg.senderAddress();
        if (!recipientAddress || !senderAddress) continue;
        if (recipientAddress === walletAddress) {
          dispatchConversations([{ peerAddress: senderAddress }]);
        } else if (senderAddress == walletAddress) {
          dispatchConversations([{ peerAddress: recipientAddress }]);
        }
      }
    };
    streamConversations();
  }, [client, walletAddress]);

  return (
    <XmtpContext.Provider
      value={{
        wallet,
        walletAddress,
        client,
        conversations,
        connect,
        disconnect,
      }}
    >
      {children}
    </XmtpContext.Provider>
  );
};

export default XmtpContext;
