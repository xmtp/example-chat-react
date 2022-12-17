import { useCallback, useEffect } from 'react'
import { ethers, Wallet } from 'ethers'
import { useAppStore } from '../store/app'
import { isAppEnvDemo } from '../helpers'

function getInfuraId() {
  return process.env.NEXT_PUBLIC_INFURA_ID || 'c518355f44bd45709cf0d42567d7bdb4'
}

const useWalletProviderDemo = () => {
  const address = useAppStore((state) => state.address)
  const provider = useAppStore((state) => state.provider)
  const setProvider = useAppStore((state) => state.setProvider)
  const setAddress = useAppStore((state) => state.setAddress)
  const setSigner = useAppStore((state) => state.setSigner)

  const connect = useCallback(async () => {
    const isDemoEnv = isAppEnvDemo()
    if (isDemoEnv) {
      try {
        if (!address) {
          const newSigner = Wallet.createRandom()
          setSigner(newSigner)
          setAddress(newSigner.address)
          return newSigner
        }
      } catch (e) {
        console.log('error', e)
      }
    }
  }, [address])

  useEffect(() => {
    if (!provider) {
      setProvider(new ethers.providers.InfuraProvider('mainnet', getInfuraId()))
      connect()
    }
  }, [provider])

  return {
    connect,
  }
}

export default useWalletProviderDemo
