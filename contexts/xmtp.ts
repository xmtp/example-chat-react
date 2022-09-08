import { createContext } from 'react'
import { Client, Message } from '@xmtp/xmtp-js'
import { Conversation } from '@xmtp/xmtp-js'
import { Signer } from 'ethers'

export type MessageStoreEvent = {
  peerAddress: string
  messages: Message[]
}

export type XmtpContextType = {
  client: Client | undefined | null
  conversations: Map<string, Conversation> | null
  loadingConversations: boolean
  initClient: (wallet: Signer) => void
}

export const XmtpContext = createContext<XmtpContextType>({
  client: undefined,
  conversations: null,
  loadingConversations: false,
  initClient: () => undefined,
})

export default XmtpContext
