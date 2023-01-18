import { useCallback, useEffect } from 'react'
import { ethers } from 'ethers'
import { useAppStore } from '../store/app'
import { chains, getEnsName } from '../helpers/ethereumClient'
import { getEnsAddress } from '../helpers/ethereumClient'
import { useWeb3Modal } from '@web3modal/react'
import { useSigner } from 'wagmi'

// Ethereum mainnet
const ETH_CHAIN_ID = 1

const cachedLookupAddress = new Map<string, string | undefined>()
const cachedResolveName = new Map<string, string | undefined>()
const cachedGetAvatarUrl = new Map<string, string | undefined>()

// This variables are not added in state on purpose.
// It saves few re-renders which then trigger the children to re-render
// Consider the above while moving it to state variables
let provider: ethers.providers.Web3Provider

const useWalletProvider = () => {
  const { open: openWeb3Modal, isOpen } = useWeb3Modal()
  const { data: signer } = useSigner()
  const setSigner = useAppStore((state) => state.setSigner)
  const reset = useAppStore((state) => state.reset)

  useEffect(() => {
    signer && setSigner(signer)
  }, [signer, setSigner])

  const resolveName = useCallback(async (name: string) => {
    if (cachedResolveName.has(name)) {
      return cachedResolveName.get(name)
    }

    const chainId = chains[0].id

    if (Number(chainId) !== ETH_CHAIN_ID) {
      return undefined
    }
    const address = (await getEnsAddress(name)) || undefined
    // const address = (await provider?.resolveName(name)) || undefined
    cachedResolveName.set(name, address)
    return address
  }, [])

  const lookupAddress = useCallback(async (address: string) => {
    if (cachedLookupAddress.has(address)) {
      return cachedLookupAddress.get(address)
    }

    const chainId = chains[0].id

    if (Number(chainId) !== ETH_CHAIN_ID) {
      return undefined
    }

    const name = (await getEnsName(address)) || undefined

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
    Object.keys(localStorage).forEach((key) => {
      if (
        key.startsWith('xmtp') ||
        key.startsWith('wagmi') ||
        key.startsWith('-walletlink')
      ) {
        localStorage.removeItem(key)
      }
    })
    reset()
  }, [reset])

  // const handleAccountsChanged = useCallback(() => {
  //   console.log('accountsChanged, disconnecting')
  //   disconnect()
  // }, [disconnect])

  const connect = useCallback(async () => {
    if (isOpen) {
      return null
    }

    try {
      openWeb3Modal()
    } catch (e) {
      console.error('error opening web3 modal:', e)
    }
  }, [openWeb3Modal, isOpen])

  // TODO: Figure out if new web3modal supports this config
  // useEffect(() => {
  //   const infuraId =
  //     process.env.NEXT_PUBLIC_INFURA_ID || 'b6058e03f2cd4108ac890d3876a56d0d'
  //   const providerOptions: IProviderOptions = {
  //     walletconnect: {
  //       package: WalletConnectProvider,
  //       options: {
  //         infuraId,
  //       },
  //     },
  //   }
  //   if (
  //     !window.ethereum ||
  //     (window.ethereum && !window.ethereum.isCoinbaseWallet)
  //   ) {
  //     providerOptions.walletlink = {
  //       package: WalletLink,
  //       options: {
  //         appName: 'Chat via XMTP',
  //         infuraId,
  //         // darkMode: false,
  //       },
  //     }
  //   }
  //   if (!window.ethereum || !window.ethereum.isMetaMask) {
  //     providerOptions['custom-metamask'] = {
  //       display: {
  //         logo: providers.METAMASK.logo,
  //         name: 'Install MetaMask',
  //         description: 'Connect using browser wallet',
  //       },
  //       package: {},
  //       connector: async () => {
  //         window.open('https://metamask.io')
  //         // throw new Error("MetaMask not installed");
  //       },
  //     }
  //   }
  //   !web3Modal &&
  //     setWeb3Modal(new Web3Modal({ cacheProvider: true, providerOptions }))
  // }, [])

  return {
    resolveName,
    lookupAddress,
    getAvatarUrl,
    connect,
    disconnect,
  }
}

export default useWalletProvider
