import { createContext, Dispatch } from 'react'
import { Client, Message } from '@xmtp/xmtp-js'
import { Signer } from 'ethers'
import { Conversation } from '@xmtp/xmtp-js/dist/types/src/conversations'

export type MessageStoreEvent = {
  peerAddress: string
  messages: Message[]
}

export type XmtpContextType = {
  wallet: Signer | undefined
  walletAddress: string | undefined
  client: Client | undefined
  conversations: Conversation[]
  getMessages: (peerAddress: string) => Message[]
  dispatchMessages?: Dispatch<MessageStoreEvent>
  connect: (wallet: Signer) => void
  disconnect: () => void
}

export const XmtpContext = createContext<XmtpContextType>({
  wallet: undefined,
  walletAddress: undefined,
  client: undefined,
  conversations: [],
  getMessages: () => [],
  connect: () => undefined,
  disconnect: () => undefined,
})

export default XmtpContext
