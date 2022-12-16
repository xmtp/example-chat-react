import { useCallback, useState } from 'react'
import { useAppStore } from '../store/app'

// Ethereum mainnet
const ETH_CHAIN_ID = 1

const cachedLookupAddress = new Map<string, string | undefined>()
const cachedResolveName = new Map<string, string | undefined>()
const cachedGetAvatarUrl = new Map<string, string | undefined>()

const useEnsHooks = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const provider = useAppStore((state) => state.provider)

  const resolveName = useCallback(
    async (name: string) => {
      if (cachedResolveName.has(name)) {
        return cachedResolveName.get(name)
      }

      setLoading(true)
      const { chainId } = (await provider?.getNetwork()) || {}

      if (Number(chainId) !== ETH_CHAIN_ID) {
        return undefined
      }
      const address = (await provider?.resolveName(name)) || undefined
      cachedResolveName.set(name, address)
      setLoading(false)
      return address
    },
    [provider]
  )

  const lookupAddress = useCallback(
    async (address: string) => {
      if (cachedLookupAddress.has(address)) {
        return cachedLookupAddress.get(address)
      }
      setLoading(true)
      const { chainId } = (await provider?.getNetwork()) || {}

      if (Number(chainId) !== ETH_CHAIN_ID) {
        return undefined
      }

      const name = (await provider?.lookupAddress(address)) || undefined
      cachedLookupAddress.set(address, name)
      setLoading(false)
      return name
    },
    [provider]
  )

  const getAvatarUrl = useCallback(
    async (address: string) => {
      const name = await lookupAddress(address)
      if (name) {
        if (cachedGetAvatarUrl.has(name)) {
          return cachedGetAvatarUrl.get(name)
        }
        setLoading(true)
        const avatarUrl = (await provider?.getAvatar(name)) || undefined
        cachedGetAvatarUrl.set(name, avatarUrl)
        setLoading(false)
        return avatarUrl
      }
    },
    [provider]
  )

  return {
    resolveName,
    lookupAddress,
    getAvatarUrl,
    loading,
  }
}

export default useEnsHooks
