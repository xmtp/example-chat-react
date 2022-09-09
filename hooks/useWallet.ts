import { ethers, Signer } from 'ethers'
import { useEffect, useMemo, useState } from 'react'

const useWallet = (): Signer | undefined => {
  const [signer, setSigner] = useState<Signer>()
  const provider = useMemo(
    () =>
      typeof window !== 'undefined'
        ? new ethers.providers.Web3Provider(window.ethereum)
        : null,
    []
  )

  useEffect(() => {
    if (!provider) return
    provider
      .send('eth_requestAccounts', [])
      .then(() => setSigner(provider.getSigner()))
  }, [provider])

  useEffect(() => {
    if (!provider) return
    window.ethereum.on('accountsChanged', () => setSigner(provider.getSigner()))
  }, [provider])

  return signer
}

export default useWallet
