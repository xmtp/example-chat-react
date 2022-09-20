import React, { useCallback, useEffect, useRef } from 'react'
import useConversation from '../../hooks/useConversation'
import { MessagesList, MessageComposer } from './'
import Loader from '../../components/Loader'

type ConversationProps = {
  recipientWalletAddr: string
}

const Conversation = ({
  recipientWalletAddr,
}: ConversationProps): JSX.Element => {
  const messagesEndRef = useRef(null)

  const scrollToMessagesEndRef = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(messagesEndRef.current as any)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const { messages, sendMessage, loading } = useConversation(
    recipientWalletAddr,
    scrollToMessagesEndRef
  )

  const hasMessages = messages.length > 0

  useEffect(() => {
    if (!hasMessages) return
    const initScroll = () => {
      scrollToMessagesEndRef()
    }
    initScroll()
  }, [recipientWalletAddr, hasMessages, scrollToMessagesEndRef])

  if (!recipientWalletAddr) {
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
      <MessagesList messagesEndRef={messagesEndRef} messages={messages} />
      <MessageComposer onSend={sendMessage} />
    </main>
  )
}

export default React.memo(Conversation)
