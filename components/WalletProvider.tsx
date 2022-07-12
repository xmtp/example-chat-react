import { useCallback, useEffect, useState } from 'react'
import { ethers, Signer, Wallet } from 'ethers'
import Web3Modal, { IProviderOptions, providers } from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import WalletLink from 'walletlink'
import { WalletContext } from '../contexts/wallet'

const ETH_CHAIN_ID = 1 // Ethereum mainnet
const INFURA_ID =
  process.env.NEXT_PUBLIC_INFURA_ID || 'b6058e03f2cd4108ac890d3876a56d0d'
const PRIVATE_KEY =
  process.env.NEXT_PUBLIC_PRIVATE_KEY ||
  'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
const URL = INFURA_ID ? `https://mainnet.infura.io/v3/${INFURA_ID}` : undefined
let autosign: boolean

const cachedLookupAddress = new Map<string, string | undefined>()
const cachedResolveName = new Map<string, string | undefined>()
const cachedGetAvatarUrl = new Map<string, string | undefined>()

type WalletProviderProps = {
  children?: React.ReactNode
}

export const WalletProvider = ({
  children,
}: WalletProviderProps): JSX.Element => {
  const [provider, setProvider] =
    useState<ethers.providers.StaticJsonRpcProvider>()
  const [signer, setSigner] = useState<Signer | Wallet>()
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>()
  const [address, setAddress] = useState<string>()
  const [chainId, setChainId] = useState<number>()

  const resolveName = useCallback(
    async (name: string) => {
      if (cachedResolveName.has(name)) {
        return cachedResolveName.get(name)
      }
      try {
        const address = (await provider?.resolveName(name)) || undefined
        cachedResolveName.set(name, address)
        return address
      } catch (e) {
        //catch 'invalid ENS address' error when input is only '.eth'
        console.log(e)
      }
    },
    [provider]
  )

  const lookupAddress = useCallback(
    async (address: string) => {
      if (cachedLookupAddress.has(address)) {
        return cachedLookupAddress.get(address)
      }
      const ensName = (await provider?.lookupAddress(address)) || undefined
      cachedLookupAddress.set(address, ensName)
      return ensName
    },
    [provider]
  )

  const getAvatarUrl = useCallback(
    async (name: string) => {
      if (cachedGetAvatarUrl.has(name)) {
        return cachedGetAvatarUrl.get(name)
      }
      const avatarUrl = (await provider?.getAvatar(name)) || undefined
      cachedGetAvatarUrl.set(name, avatarUrl)
      return avatarUrl
    },
    [provider]
  )

  const disconnect = useCallback(async () => {
    if (!web3Modal) return
    web3Modal.clearCachedProvider()
    localStorage.removeItem('walletconnect')
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('-walletlink')) {
        localStorage.removeItem(key)
      }
    })
    setSigner(undefined)
  }, [web3Modal])

  const handleAccountsChanged = useCallback(
    async (accounts: string[]) => {
      if (address && accounts.indexOf(address) < 0) {
        await disconnect()
      }
    },
    [address, disconnect]
  )

  const handleChainChanged = useCallback(
    ({ chainId }) => {
      console.log('Chain changed to', chainId)
      setChainId(chainId)
    },
    [setChainId]
  )

  const connectAutoSigner = useCallback(async () => {
    const signer = new Wallet(PRIVATE_KEY, provider)
    setSigner(signer)
    setAddress(await signer.getAddress())
    localStorage.autosign = true
  }, [provider])

  const connect = useCallback(
    async (autosignMsg?: boolean) => {
      const staticProvider = new ethers.providers.StaticJsonRpcProvider(
        URL,
        ETH_CHAIN_ID
      )
      setProvider(staticProvider)
      if (autosignMsg) {
        connectAutoSigner()
        return
      }
      if (!web3Modal) throw new Error('web3Modal not initialized')
      const cachedProviderJson = localStorage.getItem(
        'WEB3_CONNECT_CACHED_PROVIDER'
      )
      const cachedProviderName = cachedProviderJson
        ? JSON.parse(cachedProviderJson)
        : undefined
      try {
        const instance = cachedProviderName
          ? await web3Modal.connectTo(cachedProviderName)
          : await web3Modal.connect()
        if (!instance) return
        instance.on('accountsChanged', handleAccountsChanged)
        const provider = new ethers.providers.Web3Provider(instance, 'any')
        localStorage.autosign = false
        provider.on('network', handleChainChanged)
        const signer = provider.getSigner()
        const { chainId } = await provider.getNetwork()
        setChainId(chainId)
        setSigner(signer)
        setAddress(await signer.getAddress())
        return signer
      } catch (e) {
        // TODO: better error handling/surfacing here.
        // Note that web3Modal.connect throws an error when the user closes the
        // modal, as "User closed modal"
        console.log('error', e)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [web3Modal, handleAccountsChanged, handleChainChanged]
  )

  useEffect(() => {
    const providerOptions: IProviderOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          INFURA_ID,
        },
      },
    }

    if (
      !window.ethereum ||
      (window.ethereum && !window.ethereum.isCoinbaseWallet)
    ) {
      providerOptions.walletlink = {
        package: WalletLink,
        options: {
          appName: 'Chat via XMTP',
          INFURA_ID,
          // darkMode: false,
        },
      }
    }
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      providerOptions['custom-metamask'] = {
        display: {
          logo: providers.METAMASK.logo,
          name: 'Install MetaMask',
          description: 'Connect using browser wallet',
        },
        package: {},
        connector: async () => {
          window.open('https://metamask.io')
          // throw new Error("MetaMask not installed");
        },
      }
    }
    if (typeof window !== 'undefined') {
      setWeb3Modal(new Web3Modal({ cacheProvider: true, providerOptions }))
    }
  }, [])

  useEffect(() => {
    if (localStorage.autosign !== undefined) {
      autosign = JSON.parse(localStorage.autosign)
    }
    if (autosign) connect(autosign)
    if (!web3Modal) return
    const initCached = async () => {
      const cachedProviderJson = localStorage.getItem(
        'WEB3_CONNECT_CACHED_PROVIDER'
      )
      if (!cachedProviderJson) return
    }
    initCached()
  }, [web3Modal, handleAccountsChanged, handleChainChanged, connect])

  return (
    <WalletContext.Provider
      value={{
        provider,
        signer,
        address,
        web3Modal,
        chainId,
        resolveName,
        lookupAddress,
        getAvatarUrl,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
