import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react'
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

  const messages = useMemo(
    () => convoMessages.get(recipientWalletAddr) ?? [],
    [convoMessages, recipientWalletAddr]
  )

  const hasMessages = messages.length > 0

  useEffect(() => {
    if (!messages || !messagesEndRef.current) return
    setTimeout(() => {
      scrollToMessagesEndRef()
    }, 1000)
  }, [recipientWalletAddr, scrollToMessagesEndRef, messages])

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
      <MessagesList messagesEndRef={messagesEndRef} messages={messages} />
      <MessageComposer onSend={sendMessage} />
    </main>
  )
}

export default React.memo(Conversation)
