import packageJson from '../package.json'
import storage from 'localforage'
import { Reducer, useEffect, useReducer, useState } from 'react'
import { Client } from '@xmtp/xmtp-js'
import type { Conversation } from '@xmtp/xmtp-js'
import { XmtpContext, XmtpContextType } from '../contexts/xmtp'
import { Signer } from 'ethers'

type XmtpProviderProps = Pick<XmtpContextType, 'signer' | 'lookupAddress'>

storage.config({
  name: packageJson.name,
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
      createClient(signer)
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
