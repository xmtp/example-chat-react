import { Dict } from '@chakra-ui/utils'
import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import storage from 'localforage'
import { Reducer, useEffect, useReducer, useState } from 'react'
import { Client } from '@xmtp/xmtp-js'
import type { Conversation } from '@xmtp/xmtp-js'
import { XmtpContext, XmtpContextType } from '../contexts/xmtp'
import { Signer } from '@ethersproject/abstract-signer'

type XmtpProviderProps = Pick<XmtpContextType, 'signer' | 'lookupAddress'> & {
  theme?: Dict
}

storage.config({
  name: '@nft/chat',
  storeName: 'xmtp-identities',
  description: 'store identities for xmtp',
})

const createClient = async (signer: Signer) => {
  const address = await signer.getAddress()
  const storageKey = address.toLowerCase()
  if (!(await storage.getItem(storageKey))) {
    const keys = await Client.getKeys(signer)
    await storage.setItem(storageKey, keys)
  }
  const keys = await storage.getItem<Uint8Array>(storageKey)
  return keys
    ? Client.create(null, { privateKeyOverride: keys })
    : Client.create(signer)
}

export const XmtpProvider: React.FC<XmtpProviderProps> = ({
  children,
  signer,
  lookupAddress,
  theme,
}) => {
  const [client, setClient] = useState<Client | null>()
  const [recipient, setRecipient] = useState<string>()
  const [loadingConversations, setLoadingConversations] =
    useState<boolean>(true)

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
      createClient(signer)
        .then(setClient)
        .catch((e) => {
          console.error(e)
          setClient(null)
        })
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
    <ChakraProvider theme={theme}>
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
    </ChakraProvider>
  )
}

export default XmtpProvider
