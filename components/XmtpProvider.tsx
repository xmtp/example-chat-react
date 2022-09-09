import { Reducer, useEffect, useReducer, useState } from 'react'
import { Conversation } from '@xmtp/xmtp-js'
import { Client } from '@xmtp/xmtp-js'
import { XmtpContext, XmtpContextType } from '../contexts/xmtp'

type XmtpProviderProps = Pick<XmtpContextType, 'signer' | 'lookupAddress'>

export const XmtpProvider: React.FC<XmtpProviderProps> = ({
  children,
  signer,
  lookupAddress,
}) => {
  const [client, setClient] = useState<Client | null>()
  const [recipient, setRecipient] = useState<string>()
  const [loadingConversations, setLoadingConversations] =
    useState<boolean>(false)

  const [conversations, dispatchConversation] = useReducer<
    Reducer<Map<string, Conversation>, Conversation | undefined>
  >((state, conversation) => {
    if (conversation === undefined) return new Map()
    if (conversation.peerAddress === client?.address) return state
    state.set(conversation.peerAddress, conversation)
    return state
  }, new Map())

  useEffect(() => {
    if (signer) {
      Client.create(signer)
        .then(setClient)
        .catch(() => setClient(null))
    } else {
      setClient(undefined)
      dispatchConversation(undefined)
    }
    return () => setClient(undefined)
  }, [signer])

  useEffect(() => {
    if (!client) return

    setLoadingConversations(true)
    client.conversations
      .list()
      .then((x) => x.forEach(dispatchConversation))
      .finally(() => setLoadingConversations(false))
    return () => dispatchConversation(undefined)
  }, [client])

  return (
    <XmtpContext.Provider
      value={{
        signer,
        client,
        recipient,
        setRecipient,
        lookupAddress,
        conversations,
        loadingConversations,
      }}
    >
      {children}
    </XmtpContext.Provider>
  )
}

export default XmtpProvider
