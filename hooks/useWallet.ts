import { ethers, Signer } from 'ethers'
import { useEffect, useMemo, useState } from 'react'

const useWallet = (): Signer | undefined => {
  const [signer, setSigner] = useState<Signer>()
  const provider = useMemo(
    () => new ethers.providers.Web3Provider(window.ethereum),
    []
  )

  useEffect(() => {
    provider
      .send('eth_requestAccounts', [])
      .then(() => setSigner(provider.getSigner()))
  }, [provider])
  return signer
}

export default useWallet
