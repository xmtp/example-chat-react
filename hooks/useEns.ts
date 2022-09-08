import { useState, useEffect, useContext } from 'react'
import { WalletContext } from '../contexts/wallet'

const useEns = (addressOrName: string | undefined) => {
  const { resolveName, lookupAddress, getAvatarUrl } = useContext(WalletContext)
  const [address, setAddress] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const probableAddress =
    addressOrName?.startsWith('0x') && addressOrName?.length === 42
      ? addressOrName
      : undefined
  const probableName = addressOrName?.endsWith('.eth')
    ? addressOrName
    : undefined

  useEffect(() => {
    if (!resolveName || !lookupAddress || !getAvatarUrl) return
    const initAvatarUrl = async (name: string) => {
      setAvatarUrl((await getAvatarUrl(name)) as string)
    }
    const initName = async (probableAddress: string) => {
      setLoading(true)
      setName((await lookupAddress(probableAddress)) as string)
      if (name) await initAvatarUrl(name)
      setLoading(false)
    }
    const initAddress = async (probableName: string) => {
      setLoading(true)
      setAddress((await resolveName(probableName)) as string)
      await initAvatarUrl(probableName)
      setLoading(false)
    }
    if (probableAddress) {
      initName(probableAddress)
    }
    if (probableName) {
      initAddress(probableName)
    }
  }, [
    probableName,
    probableAddress,
    name,
    resolveName,
    lookupAddress,
    getAvatarUrl,
  ])

  return {
    address: probableAddress || (address as string | undefined),
    name: probableName || (name as string | undefined),
    avatarUrl: avatarUrl as string | undefined,
    loading,
  }
}

export default useEns
