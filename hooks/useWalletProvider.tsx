import { useCallback, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Web3Modal, { IProviderOptions, providers } from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import WalletLink from 'walletlink'
import { useAppStore } from '../store/app'
import { isAppEnvDemo } from '../helpers'
import useDisconnect from './useDisconnect'

const useWalletProvider = () => {
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>()
  const setAddress = useAppStore((state) => state.setAddress)
  const setSigner = useAppStore((state) => state.setSigner)
  const setProvider = useAppStore((state) => state.setProvider)
  const { disconnect } = useDisconnect()

  const handleAccountsChanged = useCallback(() => {
    disconnect()
  }, [disconnect])

  const connect = useCallback(async () => {
    const isDemoEnv = isAppEnvDemo()
    if (!isDemoEnv) {
      if (!web3Modal) {
        throw new Error('web3Modal not initialized')
      }
      try {
        const instance = await web3Modal.connect()
        if (!instance) {
          return
        }
        instance.on('accountsChanged', handleAccountsChanged)
        const newProvider = new ethers.providers.Web3Provider(instance, 'any')
        const newSigner = newProvider.getSigner()
        setProvider(newProvider)
        setSigner(newSigner)
        setAddress(await newSigner.getAddress())
        return newSigner
      } catch (e) {
        // TODO: better error handling/surfacing here.
        // Note that web3Modal.connect throws an error when the user closes the
        // modal, as "User closed modal"
        console.log('error', e)
      }
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
    if (!web3Modal) {
      return
    }
    const initCached = async () => {
      try {
        const cachedProviderJson = localStorage.getItem(
          'WEB3_CONNECT_CACHED_PROVIDER'
        )
        if (!cachedProviderJson) {
          return
        }
        const cachedProviderName = JSON.parse(cachedProviderJson)
        const instance = await web3Modal.connectTo(cachedProviderName)
        if (!instance) {
          return
        }
        instance.on('accountsChanged', handleAccountsChanged)
        const newProvider = new ethers.providers.Web3Provider(instance, 'any')
        const newSigner = newProvider.getSigner()
        setProvider(newProvider)
        setSigner(newSigner)
        setAddress(await newSigner.getAddress())
      } catch (e) {
        console.error(e)
      }
    }
    initCached()
  }, [web3Modal])

  return {
    connect,
  }
}

export default useWalletProvider
