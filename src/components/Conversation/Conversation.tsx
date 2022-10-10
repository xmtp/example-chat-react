import React, { useCallback, useContext, useEffect, useRef } from 'react'
import useConversation from '../../hooks/useConversation'
import Loader from '../../components/Loader'
import XmtpContext from '../../contexts/xmtp'
import MessagesList from './MessagesList'
import MessageComposer from './MessageComposer'

const Conversation = (): JSX.Element => {
  const { recipient } = useContext(XmtpContext)
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
