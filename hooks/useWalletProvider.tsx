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
  // useWalletProvider()
  // const [web3Modal, setWeb3Modal] = useState<Web3Modal>()
  // const setAddress = useAppStore((state) => state.setAddress)
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

  // const connect = useCallback(async () => {
  //   // if (!web3Modal) {
  //   //   throw new Error('web3Modal not initialized')
  //   // }
  //   if (isOpen) {
  //     return null
  //   }

  //   try {
  //     openWeb3Modal()
  //     // const instance = await web3Modal.connect()
  //     // if (!instance) {
  //     //   return
  //     // }
  //     // instance.on('accountsChanged', handleAccountsChanged)

  //     // provider = new ethers.providers.Web3Provider(instance, 'any')
  //     // const newSigner = provider.getSigner()
  //     // setSigner(newSigner)
  //     // setAddress(await newSigner.getAddress())
  //     // return newSigner
  //   } catch (e) {
  //     // TODO: better error handling/surfacing here.
  //     // Note that web3Modal.connect throws an error when the user closes the
  //     // modal, as "User closed modal"
  //     console.log('error', e)
  //   }
  // }, [isOpen, openWeb3Modal])

  // useEffect(() => {
  //   console.log('useWalletProvider: initializing web3Modal')

  // TODO: Remove this, don't need all the useEffect stuff with the new web3modal stuff
  // useEffect(() => {
  //   if (!web3Modal) {
  //     return
  //   }
  //   const initCached = async () => {
  //     try {
  //       const cachedProviderJson = localStorage.getItem(
  //         'WEB3_CONNECT_CACHED_PROVIDER'
  //       )
  //       if (!cachedProviderJson) {
  //         return
  //       }
  //       const cachedProviderName = JSON.parse(cachedProviderJson)
  //       const instance = await web3Modal.connectTo(cachedProviderName)
  //       if (!instance) {
  //         return
  //       }
  //       instance.on('accountsChanged', handleAccountsChanged)
  //       provider = new ethers.providers.Web3Provider(instance, 'any')
  //       const newSigner = provider.getSigner()
  //       setSigner(newSigner)
  //       setAddress(await newSigner.getAddress())
  //     } catch (e) {
  //       console.error(e)
  //     }
  //   }
  //   initCached()
  // }, [web3Modal])

  return {
    resolveName,
    lookupAddress,
    getAvatarUrl,
    connect,
    disconnect,
  }
}

export default useWalletProvider
