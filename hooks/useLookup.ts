import { useContext, useEffect, useState } from 'react'
import XmtpContext, { Account } from '../contexts/xmtp'

const useLookup = (address?: string) => {
  const { lookupAddress } = useContext(XmtpContext)
  const [account, setAccount] = useState<Account>({})
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!address) return
    if (!lookupAddress) return
    setLoading(true)
    lookupAddress(address)
      .then(setAccount)
      .catch(console.error)
      .finally(() => setLoading(false))
    return () => setAccount({})
  }, [setAccount, address, lookupAddress])

  return { data: account, loading }
}

export default useLookup
