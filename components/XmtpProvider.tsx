import { useCallback, useEffect, useState } from 'react'
import { Client } from '@xmtp/xmtp-js'
import { Signer } from 'ethers'
import { getEnv } from '../helpers'
import { XmtpContext, XmtpContextType } from '../contexts/xmtp'
import { useAppStore } from '../store/app'

export const XmtpProvider: React.FC = ({ children }) => {
  const walletAddress = useAppStore((state) => state.address)
  const signer = useAppStore((state) => state.signer)
  const client = useAppStore((state) => state.client)
  const setClient = useAppStore((state) => state.setClient)
  const convoMessages = useAppStore((state) => state.convoMessages)
  const setConvoMessages = useAppStore((state) => state.setConvoMessages)
  const conversations = useAppStore((state) => state.conversations)
  const setConversations = useAppStore((state) => state.setConversations)
  const loadingConversations = useAppStore(
    (state) => state.loadingConversations
  )
  const setLoadingConversations = useAppStore(
    (state) => state.setLoadingConversations
  )

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

  const disconnect = () => {
    setClient(undefined)
    setConversations(new Map())
    setConvoMessages(new Map())
  }

  useEffect(() => {
    signer ? initClient(signer) : disconnect()
  }, [signer])

  useEffect(() => {
    if (!client) return

    const listConversations = async () => {
      console.log('Listing conversations')
      setLoadingConversations(true)
      const convos = await client.conversations.list()
      Promise.all(
        convos.map(async (convo) => {
          if (convo.peerAddress !== walletAddress) {
            const messages = await convo.messages()
            convoMessages.set(convo.peerAddress, messages)
            setConvoMessages(new Map(convoMessages))
            conversations?.set(convo.peerAddress, convo)
            setConversations(new Map(conversations))
          }
        })
      ).then(() => {
        setLoadingConversations(false)
        if (Notification.permission === 'default') {
          Notification.requestPermission()
        }
      })
    }
    const streamConversations = async () => {
      const stream = await client.conversations.stream()
      for await (const convo of stream) {
        if (convo.peerAddress !== walletAddress) {
          const messages = await convo.messages()
          convoMessages.set(convo.peerAddress, messages)
          setConvoMessages(new Map(convoMessages))
          conversations.set(convo.peerAddress, convo)
          setConversations(new Map(conversations))
        }
      }
    }
    listConversations()
    streamConversations()
  }, [client])

  const [providerState, setProviderState] = useState<XmtpContextType>({
    initClient,
  })

  useEffect(() => {
    setProviderState({
      initClient,
    })
  }, [client, initClient, loadingConversations, conversations, convoMessages])

  return (
    <XmtpContext.Provider value={providerState}>
      {children}
    </XmtpContext.Provider>
  )
}

export default XmtpProvider
