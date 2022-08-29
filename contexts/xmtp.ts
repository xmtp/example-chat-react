import { createContext } from 'react'
import { Client, Message } from '@xmtp/xmtp-js'
import { Conversation } from '@xmtp/xmtp-js'

export type MessageStoreEvent = {
  peerAddress: string
  messages: Message[]
}

export type XmtpContextType = {
  client: Client | undefined
  conversations: Conversation[]
  loadingConversations: boolean
}

export const XmtpContext = createContext<XmtpContextType>({
  client: undefined,
  conversations: [],
  loadingConversations: false,
})

export default XmtpContext
