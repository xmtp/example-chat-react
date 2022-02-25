import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useRef } from 'react'
import useXmtp from '../../hooks/useXmtp'
import useConversation from '../../hooks/useConversation'
import { MessagesList, MessageComposer } from '../../components/Conversation'
import Loader from '../../components/Loader'

const Conversation: NextPage = () => {
  const router = useRouter()
  const recipientWalletAddr = router.query.recipientWalletAddr as string
  const { walletAddress, client } = useXmtp()
  const messagesEndRef = useRef(null)
  const scrollToMessagesEndRef = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(messagesEndRef.current as any)?.scrollIntoView({ behavior: 'smooth' })
  }, [messagesEndRef])

  const { messages, sendMessage, loading } = useConversation(
    recipientWalletAddr,
    scrollToMessagesEndRef
  )

  if (!recipientWalletAddr || !walletAddress || !client) {
    return <div />
  }
  if (loading && !messages?.length) {
    return (
      <Loader
        headingText="Loading messages..."
        subHeadingText="Please wait a moment"
        isLoading
      />
    )
  }

  return (
    <main className="flex flex-col flex-1 bg-white h-screen">
      <MessagesList
        messagesEndRef={messagesEndRef}
        messages={messages}
        walletAddress={walletAddress}
      />
      {walletAddress && <MessageComposer onSend={sendMessage} />}
    </main>
  )
}

export default Conversation
