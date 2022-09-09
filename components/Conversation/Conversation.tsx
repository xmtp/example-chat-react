import React, { useCallback, useContext, useEffect, useRef } from 'react'
import useConversation from '../../hooks/useConversation'
import { MessagesList, MessageComposer } from './'
import Loader from '../../components/Loader'
import XmtpContext from '../../contexts/xmtp'

const Conversation = (): JSX.Element => {
  const { signer, recipient } = useContext(XmtpContext)
  const messagesEndRef = useRef(null)

  const scrollToMessagesEndRef = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(messagesEndRef.current as any)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const { messages, sendMessage, loading } = useConversation(
    recipient,
    scrollToMessagesEndRef
  )

  const hasMessages = messages.length > 0

  useEffect(() => {
    if (!hasMessages) return
    scrollToMessagesEndRef()
  }, [scrollToMessagesEndRef, recipient, hasMessages])

  if (!signer) return <div />
  if (!recipient) return <div />

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
        signer={signer}
        messagesEndRef={messagesEndRef}
        messages={messages}
      />
      <MessageComposer onSend={sendMessage} />
    </main>
  )
}

export default React.memo(Conversation)
