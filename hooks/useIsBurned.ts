import axios from 'axios'
import { useEffect, useState } from 'react'

export type IsBurnedResponse = {
  msg?: string
  hacked?: boolean
}

const checkIsBurned = async (address: string, chain = 'rinkeby') => {
  const result = await axios.get(
    `https://burnmywallet.com/api/isBurned?address=${address}&chain=${chain}`
  )
  console.log('handleSearch after api call', result.data)

  const data = result.data as IsBurnedResponse

  return data.hacked
}

const useIsBurned = (address: string) => {
  const [isBurned, setIsBurned] = useState(false)

  const isHackedEffect = async (senderAddress: string) => {
    const result = await checkIsBurned(senderAddress)
    if (result) {
      setIsBurned(result)
    }
  }

  useEffect(() => {
    isHackedEffect(address)
  }, [address])

  return isBurned
}

export default useIsBurned
