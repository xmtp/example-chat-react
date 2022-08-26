import { useEffect, useReducer, useState } from 'react'
import { Conversation } from '@xmtp/xmtp-js'
import { Client } from '@xmtp/xmtp-js'
import { Signer } from 'ethers'
import { getEnv } from '../helpers'
import { XmtpContext, XmtpContextType } from '../contexts/xmtp'
import useMessageStore from '../hooks/useMessageStore'

export const XmtpProvider: React.FC = ({ children }) => {
  const [wallet, setWallet] = useState<Signer>()
  const [client, setClient] = useState<Client>()
  const { getMessages, dispatchMessages } = useMessageStore()
  const [loadingConversations, setLoadingConversations] =
    useState<boolean>(false)

  const [conversations, dispatchConversations] = useReducer(
    (state: Conversation[], newConvos: Conversation[] | undefined) => {
      if (newConvos === undefined) {
        return []
      }
      newConvos = newConvos.filter(
        (convo) =>
          state.findIndex((otherConvo) => {
            return convo.peerAddress === otherConvo.peerAddress
          }) < 0 && convo.peerAddress != client?.address
      )
      return newConvos === undefined ? [] : state.concat(newConvos)
    },
    []
  )

  const connect = (wallet: Signer) => {
    setWallet(wallet)
  }

  const disconnect = () => {
    setWallet(undefined)
    setClient(undefined)
    dispatchConversations(undefined)
  }

  useEffect(() => {
    const initClient = async () => {
      if (!wallet) return
      setClient(await Client.create(wallet, { env: getEnv() }))
    }
    initClient()
  }, [wallet])

  useEffect(() => {
    if (!client) return

    const listConversations = async () => {
      console.log('Listing conversations')
      setLoadingConversations(true)
      const convos = await client.conversations.list()
      convos.forEach((convo: Conversation) => {
        dispatchConversations([convo])
      })
      setLoadingConversations(false)
    }
    const streamConversations = async () => {
      const stream = await client.conversations.stream()
      for await (const convo of stream) {
        dispatchConversations([convo])
      }
    }
    streamConversations()
    listConversations()
  }, [client])

  const [providerState, setProviderState] = useState<XmtpContextType>({
    wallet,
    client,
    conversations,
    loadingConversations,
    getMessages,
    dispatchMessages,
    connect,
    disconnect,
  })

  useEffect(() => {
    setProviderState({
      wallet,
      client,
      conversations,
      loadingConversations,
      getMessages,
      dispatchMessages,
      connect,
      disconnect,
    })
  }, [
    wallet,
    client,
    conversations,
    loadingConversations,
    getMessages,
    dispatchMessages,
  ])

  return (
    <XmtpContext.Provider value={providerState}>
      {children}
    </XmtpContext.Provider>
  )
}

export default XmtpProvider
