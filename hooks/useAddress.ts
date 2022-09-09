import { Signer } from 'ethers'
import { useEffect, useState } from 'react'

const useAddress = (signer?: Signer) => {
  const [address, setAddress] = useState<string>()
  useEffect(() => {
    if (!signer) return
    signer.getAddress().then(setAddress)
    return () => setAddress(undefined)
  }, [signer])
  return address
}

export default useAddress
