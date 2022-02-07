import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ethers, Signer } from "ethers";
import Web3Modal, { IProviderOptions, providers } from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import WalletLink from "walletlink";

type WalletContextType = {
  signer: Signer | undefined;
  address: string | undefined;
  web3Modal: Web3Modal | undefined;
  connect: () => Promise<Signer | undefined>;
  disconnect: () => Promise<void>;
};

const WalletContext = createContext<WalletContextType>({
  signer: undefined,
  address: undefined,
  web3Modal: undefined,
  connect: async () => undefined,
  disconnect: async () => undefined,
});

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within an WalletProvider");
  }
  return context;
};

type WalletProviderProps = {
  children?: React.ReactNode;
};

export const WalletProvider = ({
  children,
}: WalletProviderProps): JSX.Element => {
  const [signer, setSigner] = useState<Signer>();
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>();
  const [address, setAddress] = useState<string>();

  const connect = async () => {
    if (!web3Modal) throw new Error("web3Modal not initialized");
    try {
      const instance = await web3Modal.connect();
      if (!instance) return;
      instance.on("accountsChanged", handleAccountsChanged);
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();
      setSigner(signer);
      setAddress(await signer.getAddress());
      return signer;
    } catch (e) {
      // TODO: better error handling/surfacing here.
      // Note that web3Modal.connect throws an error when the user closes the
      // modal, as "User closed modal"
      console.log("error", e);
    }
  };

  const disconnect = useCallback(async () => {
    if (!web3Modal) return;
    web3Modal.clearCachedProvider();
    localStorage.removeItem("walletconnect");
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("-walletlink")) {
        localStorage.removeItem(key);
      }
    });
    setSigner(undefined);
  }, [web3Modal]);

  const handleAccountsChanged = useCallback(
    async (accounts: string[]) => {
      if (address && accounts.indexOf(address) < 0) {
        await disconnect();
      }
    },
    [address, disconnect]
  );

  useEffect(() => {
    const infuraId =
      process.env.NEXT_PUBLIC_INFURA_ID || "b6058e03f2cd4108ac890d3876a56d0d";
    const providerOptions: IProviderOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId,
        },
      },
    };
    if (
      !window.ethereum ||
      (window.ethereum && !window.ethereum.isCoinbaseWallet)
    ) {
      providerOptions.walletlink = {
        package: WalletLink,
        options: {
          appName: "Chat via XMTP",
          infuraId,
          // darkMode: false,
        },
      };
    }
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      providerOptions["custom-metamask"] = {
        display: {
          logo: providers.METAMASK.logo,
          name: "Install MetaMask",
          description: "Connect using browser wallet",
        },
        package: {},
        connector: async () => {
          window.open("https://metamask.io");
          // throw new Error("MetaMask not installed");
        },
      };
    }
    setWeb3Modal(new Web3Modal({ cacheProvider: true, providerOptions }));
  }, []);

  useEffect(() => {
    if (!web3Modal) return;
    const initCached = async () => {
      const cachedProviderJson = localStorage.getItem(
        "WEB3_CONNECT_CACHED_PROVIDER"
      );
      if (!cachedProviderJson) return;
      const cachedProviderName = JSON.parse(cachedProviderJson);
      const instance = await web3Modal.connectTo(cachedProviderName);
      if (!instance) return;
      instance.on("accountsChanged", handleAccountsChanged);
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();
      setSigner(signer);
      setAddress(await signer.getAddress());
    };
    initCached();
  }, [web3Modal, handleAccountsChanged]);

  return (
    <WalletContext.Provider
      value={{
        signer,
        address,
        web3Modal,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContext;
