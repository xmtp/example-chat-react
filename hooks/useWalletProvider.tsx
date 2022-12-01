import { useCallback } from 'react'
import { useProvider } from 'wagmi'

// Ethereum mainnet
const ETH_CHAIN_ID = 1

const cachedLookupAddress = new Map<string, string | undefined>()
const cachedResolveName = new Map<string, string | undefined>()
const cachedGetAvatarUrl = new Map<string, string | undefined>()

// This variables are not added in state on purpose.
// It saves few re-renders which then trigger the children to re-render
// Consider the above while moving it to state variables

const useWalletProvider = () => {
  const provider = useProvider()

  const resolveName = useCallback(async (name: string) => {
    if (cachedResolveName.has(name)) {
      return cachedResolveName.get(name)
    }

    const { chainId } = (await provider?.getNetwork()) || {}

    if (Number(chainId) !== ETH_CHAIN_ID) {
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
    const { chainId } = (await provider?.getNetwork()) || {}

    if (Number(chainId) !== ETH_CHAIN_ID) {
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

  return {
    resolveName,
    lookupAddress,
    getAvatarUrl,
  }
}

export default useWalletProvider
