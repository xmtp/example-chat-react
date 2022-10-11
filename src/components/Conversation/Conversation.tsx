import React, { useCallback, useEffect, useRef } from 'react'
import useConversation from '../../hooks/useConversation'
import Loader from '../../components/Loader'
import MessagesList from './MessagesList'
import MessageComposer from './MessageComposer'
import useChat from '../../hooks/useChat'

const Conversation = (): JSX.Element => {
  const { recipient } = useChat()
  const messagesEndRef = useRef(null)

  const scrollToMessagesEndRef = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(messagesEndRef.current as any)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const { messages, sendMessage, loading } = useConversation(
    recipient,
    scrollToMessagesEndRef
  )

  useEffect(() => {
    if (messages.length === 0) return
    scrollToMessagesEndRef()
  }, [scrollToMessagesEndRef, recipient, messages])

  if (!recipient) return <div />

  if (loading && !messages?.length) {
    return (
      <Loader
        headingText="Loading messages..."
        subHeadingText="Please wait a moment"
      />
    )
  }

  return (
    <>
      <MessagesList messagesEndRef={messagesEndRef} messages={messages} />
      <MessageComposer onSend={sendMessage} />
    </>
  )
}

export default Conversation
