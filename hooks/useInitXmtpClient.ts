import { Client } from '@xmtp/xmtp-js'
import { Signer } from 'ethers'
import { useCallback, useEffect } from 'react'
import { getEnv } from '../helpers'
import { useAppStore } from '../store/app'

const useInitXmtpClient = () => {
  const signer = useAppStore((state) => state.signer)
  const client = useAppStore((state) => state.client)
  const setClient = useAppStore((state) => state.setClient)
  const setConvoMessages = useAppStore((state) => state.setConvoMessages)
  const setConversations = useAppStore((state) => state.setConversations)

  const disconnect = () => {
    setClient(undefined)
    setConversations(new Map())
    setConvoMessages(new Map())
  }

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

  useEffect(() => {
    signer ? initClient(signer) : disconnect()
  }, [signer])

  return {
    initClient,
  }
}

export default useInitXmtpClient
