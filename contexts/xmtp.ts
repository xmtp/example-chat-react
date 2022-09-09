import { createContext } from 'react'
import { Client } from '@xmtp/xmtp-js'
import { Conversation } from '@xmtp/xmtp-js'
import { Signer } from 'ethers'

export type XmtpContextType = {
  signer: Signer | undefined
  client: Client | undefined | null

  recipient: string | undefined
  setRecipient: (recipient: string | undefined) => void

  conversations: Map<string, Conversation> | null
  loadingConversations: boolean
}

export const XmtpContext = createContext<XmtpContextType>({
  signer: undefined,
  client: undefined,
  recipient: undefined,
  setRecipient: () => {
    throw new Error('not implemented')
  },
  conversations: null,
  loadingConversations: false,
})

export default XmtpContext
