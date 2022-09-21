import { useCallback, useContext, useEffect, useState } from 'react'
import { Client, Conversation, Message } from '@xmtp/xmtp-js'
import { Signer } from 'ethers'
import { getEnv } from '../helpers'
import { XmtpContext, XmtpContextType } from '../contexts/xmtp'
import { WalletContext } from '../contexts/wallet'

export const XmtpProvider: React.FC = ({ children }) => {
  const [client, setClient] = useState<Client | null>()
  const { signer, address: walletAddress } = useContext(WalletContext)
  const [convoMessages, setConvoMessages] = useState<Map<string, Message[]>>(
    new Map()
  )
  const [loadingConversations, setLoadingConversations] =
    useState<boolean>(true)
  const [conversations, setConversations] = useState<Map<string, Conversation>>(
    new Map()
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
            conversations.set(convo.peerAddress, convo)
            setConversations(new Map(conversations))
          }
        })
      ).then(() => setLoadingConversations(false))
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
    client,
    initClient,
    loadingConversations,
    conversations,
    convoMessages,
    setConvoMessages,
  })

  useEffect(() => {
    setProviderState({
      client,
      initClient,
      loadingConversations,
      conversations,
      convoMessages,
      setConvoMessages,
    })
  }, [client, initClient, loadingConversations, conversations, convoMessages])

  return (
    <XmtpContext.Provider value={providerState}>
      {children}
    </XmtpContext.Provider>
  )
}

export default XmtpProvider
