import { Client } from '@xmtp/xmtp-js'
import { Signer } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { getEnv } from '../helpers'
import { useAppStore } from '../store/app'

const useInitXmtpClient = () => {
  const signer = useAppStore((state) => state.signer)
  const client = useAppStore((state) => state.client)
  const setClient = useAppStore((state) => state.setClient)
  const setConvoMessages = useAppStore((state) => state.setConvoMessages)
  const setConversations = useAppStore((state) => state.setConversations)
  const [isRequestPending, setIsRequestPending] = useState(false)

  const disconnect = () => {
    setClient(undefined)
    setConversations(new Map())
    setConvoMessages(new Map())
  }

  const initClient = useCallback(
    async (wallet: Signer) => {
      if (wallet && !client) {
        try {
          setIsRequestPending(true)
          const response = await Client.create(wallet, { env: getEnv() })
          setClient(response)
          setIsRequestPending(false)
        } catch (e) {
          console.error(e)
          setClient(null)
          setIsRequestPending(false)
        }
      }
    },
    [client]
  )

  useEffect(() => {
    if (!isRequestPending) {
      signer ? initClient(signer) : disconnect()
    }
  }, [signer, initClient])

  return {
    initClient,
  }
}

export default useInitXmtpClient
