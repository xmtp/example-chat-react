import { createContext } from 'react'
import { Client } from '@xmtp/xmtp-js'
import { Conversation } from '@xmtp/xmtp-js'
import { Signer } from 'ethers'

export type XmtpContextType = {
  signer: Signer | undefined
  client: Client | undefined | null
  conversations: Map<string, Conversation> | null
  loadingConversations: boolean
}

export const XmtpContext = createContext<XmtpContextType>({
  signer: undefined,
  client: undefined,
  conversations: null,
  loadingConversations: false,
})

export default XmtpContext
