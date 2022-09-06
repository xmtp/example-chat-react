import { createContext } from 'react'
import { Client, Message } from '@xmtp/xmtp-js'
import { Conversation } from '@xmtp/xmtp-js'

export type MessageStoreEvent = {
  peerAddress: string
  messages: Message[]
}

export type XmtpContextType = {
  client: Client | undefined
  conversations: Map<string, Conversation> | null
  loadingConversations: boolean
}

export const XmtpContext = createContext<XmtpContextType>({
  client: undefined,
  conversations: null,
  loadingConversations: false,
})

export default XmtpContext
