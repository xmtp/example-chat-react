import { useCallback, useEffect, useState } from 'react'
import { ethers, Signer } from 'ethers'
import Web3Modal, { IProviderOptions, providers } from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import WalletLink from 'walletlink'
import { WalletContext } from '../contexts/wallet'
import { useRouter } from 'next/router'

// Ethereum mainnet
const ETH_CHAIN_ID = 1

const cachedLookupAddress = new Map<string, string | undefined>()
const cachedResolveName = new Map<string, string | undefined>()
const cachedGetAvatarUrl = new Map<string, string | undefined>()

type WalletProviderProps = {
  children?: React.ReactNode
}

// This variables are not added in state on purpose.
// It saves few re-renders which then trigger the children to re-render
// Consider the above while moving it to state variables
let provider: ethers.providers.Web3Provider
let chainId: number
let signer: Signer | undefined

export const WalletProvider = ({
  children,
}: WalletProviderProps): JSX.Element => {
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>()
  const [address, setAddress] = useState<string>()
  const router = useRouter()

  const resolveName = useCallback(async (name: string) => {
    if (cachedResolveName.has(name)) {
      return cachedResolveName.get(name)
    }
    if (chainId !== ETH_CHAIN_ID) {
      return undefined
    }
    const address = (await provider?.resolveName(name)) || undefined
    cachedResolveName.set(name, address)
    return address
  }, [])

  const lookupAddress = useCallback(async (address: string) => {
    if (cachedLookupAddress.has(address)) {
      return cachedLookupAddress.get(address)
    }
    if (chainId !== ETH_CHAIN_ID) {
      return undefined
    }

    const name = (await provider?.lookupAddress(address)) || undefined
    cachedLookupAddress.set(address, name)
    return name
  }, [])

  const getAvatarUrl = useCallback(async (name: string) => {
    if (cachedGetAvatarUrl.has(name)) {
      return cachedGetAvatarUrl.get(name)
    }
    const avatarUrl = (await provider?.getAvatar(name)) || undefined
    cachedGetAvatarUrl.set(name, avatarUrl)
    return avatarUrl
  }, [])

  // Note, this triggers a re-render on acccount change and on diconnect.
  const disconnect = useCallback(() => {
    if (!web3Modal) return
    web3Modal.clearCachedProvider()
    localStorage.removeItem('walletconnect')
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('-walletlink')) {
        localStorage.removeItem(key)
      }
    })
    signer = undefined
    setAddress(undefined)
    router.push('/')
  }, [router, web3Modal])

  const handleAccountsChanged = useCallback(() => {
    disconnect()
  }, [disconnect])

  const handleChainChanged = ({ chainId: newChainId }: { chainId: number }) => {
    console.log('Chain changed to', newChainId)
    chainId = newChainId
  }

  const connect = useCallback(async () => {
    if (!web3Modal) throw new Error('web3Modal not initialized')
    try {
      const instance = await web3Modal.connect()
      if (!instance) return
      instance.on('accountsChanged', handleAccountsChanged)
      provider = new ethers.providers.Web3Provider(instance, 'any')
      provider.on('network', handleChainChanged)
      const newSigner = provider.getSigner()
      const { chainId: newChainId } = await provider.getNetwork()
      chainId = newChainId
      signer = newSigner
      setAddress(await signer.getAddress())
      return signer
    } catch (e) {
      // TODO: better error handling/surfacing here.
      // Note that web3Modal.connect throws an error when the user closes the
      // modal, as "User closed modal"
      console.log('error', e)
    }
  }, [handleAccountsChanged, web3Modal])

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
      provider = new ethers.providers.Web3Provider(instance, 'any')
      provider.on('network', handleChainChanged)
      const newSigner = provider.getSigner()
      const { chainId: newChainId } = await provider.getNetwork()
      chainId = newChainId
      signer = newSigner
      setAddress(await signer.getAddress())
    }
    initCached()
  }, [web3Modal])

  return (
    <WalletContext.Provider
      value={{
        signer,
        address,
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
