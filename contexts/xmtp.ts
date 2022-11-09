import { createContext } from 'react'
import { Client, Message } from '@xmtp/xmtp-js'
import { Conversation } from '@xmtp/xmtp-js'
import { Signer } from 'ethers'

export type MessageStoreEvent = {
  peerAddress: string
  messages: Message[]
}

export type XmtpContextType = {
  initClient: (wallet: Signer) => void
}

export const XmtpContext = createContext<XmtpContextType>({
  initClient: () => undefined,
})

export default XmtpContext
