import { Client } from '@xmtp/xmtp-js'
import { Signer } from 'ethers'
import { useCallback } from 'react'
import { getEnv } from '../helpers'
import { useAppStore } from '../store/app'

const useInitXmtpClient = () => {
  const client = useAppStore((state) => state.client)
  const setClient = useAppStore((state) => state.setClient)

  const initClient = useCallback(
    async (wallet: Signer) => {
      if (wallet && !client) {
        try {
          setClient(await Client.create(wallet, { env: getEnv() }))
        } catch (e) {
          console.error(e)
          setClient(null)
        }
      }
    },
    [client]
  )

  return {
    initClient,
  }
}

export default useInitXmtpClient
