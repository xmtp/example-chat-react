import { useEnsAddress, useEnsName, useEnsAvatar } from 'wagmi'

const useEns = (addressOrName: string | undefined) => {
  const probableAddress =
    addressOrName?.startsWith('0x') && addressOrName?.length === 42
      ? addressOrName
      : undefined
  const probableName = addressOrName?.endsWith('.eth')
    ? addressOrName
    : undefined
  const { data: address, isLoading: loadingEnsAddress } = useEnsAddress({
    name: probableName,
  })
  const { data: ensName, isLoading: loadingEnsName } = useEnsName({
    address: probableAddress,
  })
  const { data: ensAvatar, isLoading: loadingEnsAvatar } = useEnsAvatar({
    addressOrName,
  })
  return {
    address: probableAddress || (address as string | undefined),
    ensName: probableName || (ensName as string | undefined),
    ensAvatar: ensAvatar as string | undefined,
    isLoading: loadingEnsName || loadingEnsAddress,
    isLoadingAvatar: loadingEnsAvatar,
  }
}

export default useEns
