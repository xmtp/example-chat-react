import { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@xmtp/xmtp-js";
// import newWallet from "../helpers/newWallet";
import { ethers } from "ethers";

// const localNodeBootstrapAddr =
//   "/ip4/127.0.0.1/tcp/9001/ws/p2p/16Uiu2HAmNCxLZCkXNbpVPBpSSnHj9iq4HZQj7fxRzw2kj1kKSHHA";

const testnetBootstrapAddr =
  "/dns4/bootstrap-node-0.testnet.xmtp.network/tcp/8443/wss/p2p/16Uiu2HAm888gVYpr4cZQ4qhEendQW6oYEhG8n6fnqw1jVW3Prdc6";

type XmtpContextType = {
  wallet: ethers.Wallet | undefined;
  walletAddress: string | undefined;
  client: Client | undefined;
  connect: (wallet: ethers.Wallet) => void;
  disconnect: () => void;
};

const XmtpContext = createContext<XmtpContextType>({
  wallet: undefined,
  walletAddress: undefined,
  client: undefined,
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

  const connect = async (wallet: ethers.Wallet) => {
    setWallet(wallet);
    setWalletAddress(await wallet.getAddress());
  };

  const disconnect = async () => {
    setWallet(undefined);
    setWalletAddress(undefined);
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

  return (
    <XmtpContext.Provider
      value={{
        wallet,
        walletAddress,
        client,
        connect,
        disconnect,
      }}
    >
      {children}
    </XmtpContext.Provider>
  );
};

export default XmtpContext;
