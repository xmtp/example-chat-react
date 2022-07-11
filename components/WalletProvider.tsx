import { useCallback, useEffect, useState } from 'react'
import { ethers, Signer, Wallet } from 'ethers'
import Web3Modal, { IProviderOptions, providers } from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import WalletLink from 'walletlink'
import { WalletContext } from '../contexts/wallet'

const ETH_CHAIN_ID = 1 // Ethereum mainnet
const PRIVATE_KEY = `${process.env.NEXT_PUBLIC_PRIVATE_KEY}`
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
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>()
  const [signer, setSigner] = useState<Signer | Wallet>()
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>()
  const [address, setAddress] = useState<string>()
  const [chainId, setChainId] = useState<number>()

  const resolveName = useCallback(
    async (name: string) => {
      if (cachedResolveName.has(name)) {
        return cachedResolveName.get(name)
      }
      if (chainId !== ETH_CHAIN_ID) {
        return undefined
      }
      const address = (await provider?.resolveName(name)) || undefined
      cachedResolveName.set(name, address)
      return address
    },
    [chainId, provider]
  )

  const lookupAddress = useCallback(
    async (address: string) => {
      if (cachedLookupAddress.has(address)) {
        return cachedLookupAddress.get(address)
      }
      if (chainId !== ETH_CHAIN_ID) {
        return undefined
      }

      const name = (await provider?.lookupAddress(address)) || undefined
      cachedLookupAddress.set(address, name)
      return name
    },
    [chainId, provider]
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
    // localStorage.removeItem('autosign')
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

  const connect = useCallback(
    async (autosignMsg: boolean) => {
      if (autosignMsg && PRIVATE_KEY === 'undefined') {
        throw new Error(
          'NEXT_PUBLIC_PRIVATE_KEY inside ".env.local" not assigned, see ".env.local.example" (default: hardhat wallet)'
        )
      }
      if (!web3Modal) throw new Error('web3Modal not initialized')
      try {
        const instance = await web3Modal.connect()
        if (!instance) return
        instance.on('accountsChanged', handleAccountsChanged)
        const provider = new ethers.providers.Web3Provider(instance, 'any')
        provider.on('network', handleChainChanged)
        let signer
        if (autosignMsg) {
          localStorage.autosign = true
          signer = new Wallet(PRIVATE_KEY, provider)
        } else {
          localStorage.autosign = false
          signer = provider.getSigner()
        }
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
    [web3Modal, handleAccountsChanged, handleChainChanged]
  )

  useEffect(() => {
    const infuraId =
      process.env.NEXT_PUBLIC_INFURA_ID || 'b6058e03f2cd4108ac890d3876a56d0d'
    const providerOptions: IProviderOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId,
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
          infuraId,
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
    setWeb3Modal(new Web3Modal({ cacheProvider: true, providerOptions }))
  }, [])

  useEffect(() => {
    if (localStorage.autosign != undefined) {
      autosign = JSON.parse(localStorage.autosign)
    }
    if (autosign && PRIVATE_KEY === 'undefined') {
      throw new Error(
        'NEXT_PUBLIC_PRIVATE_KEY inside ".env.local" not assigned, see ".env.local.example" (default: hardhat wallet)'
      )
    }
    if (!web3Modal) return
    const initCached = async () => {
      const cachedProviderJson = localStorage.getItem(
        'WEB3_CONNECT_CACHED_PROVIDER'
      )
      if (!cachedProviderJson) return
      const cachedProviderName = JSON.parse(cachedProviderJson)
      const instance = await web3Modal.connectTo(cachedProviderName)
      if (!instance) return
      instance.on('accountsChanged', handleAccountsChanged)
      const provider = new ethers.providers.Web3Provider(instance, 'any')
      provider.on('network', handleChainChanged)
      let signer
      if (autosign) {
        signer = new Wallet(PRIVATE_KEY, provider)
      } else {
        signer = provider.getSigner()
      }
      const { chainId } = await provider.getNetwork()
      setChainId(chainId)
      setProvider(provider)
      setSigner(signer)
      setAddress(await signer.getAddress())
    }
    initCached()
  }, [web3Modal, handleAccountsChanged, handleChainChanged])

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
