import { createContext } from 'react'
import { Client, DecodedMessage } from '@xmtp/xmtp-js'
import { Conversation } from '@xmtp/xmtp-js'
import { Signer } from 'ethers'

export type MessageStoreEvent = {
  peerAddress: string
  messages: DecodedMessage[]
}

export type XmtpContextType = {
  client: Client | undefined | null
  conversations: Map<string, Conversation> | null
  loadingConversations: boolean
  initClient: (wallet: Signer) => void
  convoMessages: Map<string, DecodedMessage[]>
  setConvoMessages: (value: Map<string, DecodedMessage[]>) => void
}

export const XmtpContext = createContext<XmtpContextType>({
  client: undefined,
  conversations: null,
  loadingConversations: false,
  initClient: () => undefined,
  convoMessages: new Map(),
  setConvoMessages: () => undefined,
})

export default XmtpContext
