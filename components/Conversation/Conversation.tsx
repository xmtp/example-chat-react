import React, { useCallback, useContext, useEffect, useRef } from 'react'
// import useConversation from '../../hooks/useConversation'
import { MessagesList, MessageComposer } from './'
import Loader from '../../components/Loader'
import XmtpContext from '../../contexts/xmtp'
import useConversation from '../../hooks/useConversation'

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

  const { sendMessage } = useConversation(
    recipientWalletAddr,
    scrollToMessagesEndRef
  )

  const { convoMessages, loadingConversations } = useContext(XmtpContext)

  const hasMessages = recipientWalletAddr
    ? (convoMessages.get(recipientWalletAddr) ?? []).length > 0
    : false

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

  if (loadingConversations && !hasMessages) {
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
        messages={convoMessages.get(recipientWalletAddr) ?? []}
      />
      <MessageComposer onSend={sendMessage} />
    </main>
  )
}

export default React.memo(Conversation)
