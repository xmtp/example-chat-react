import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useRef } from 'react'
import { useXmtp } from '../../components/XmtpContext'
import useConversation from '../../hooks/useConversation'
import { ConversationView } from '../../components/Conversation'

const Conversation: NextPage = () => {
  const router = useRouter()
  const recipientWalletAddr = router.query.recipientWalletAddr as string
  const { walletAddress } = useXmtp()
  const messagesEndRef = useRef(null)
  const scrollToMessagesEndRef = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(messagesEndRef.current as any)?.scrollIntoView({ behavior: 'smooth' })
  }, [messagesEndRef])

  const { messages, sendMessage } = useConversation(
    recipientWalletAddr,
    scrollToMessagesEndRef
  )

  if (!recipientWalletAddr) {
    return <div />
  }

  return (
    <ConversationView
      messagesEndRef={messagesEndRef}
      messages={messages}
      onSend={sendMessage}
      walletAddress={walletAddress}
    />
  )
}

export default Conversation
