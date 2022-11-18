import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MessagesList, MessageComposer } from './'
import Loader from '../../components/Loader'
import { useAppStore } from '../../store/app'
import useGetMessages from '../../hooks/useGetMessages'
import useSendMessage from '../../hooks/useSendMessage'
import { getConversationKey } from '../../helpers'
import useConversation from '../../hooks/useConversation'

type ConversationProps = {
  recipientWalletAddr: string
}

const Conversation = ({
  recipientWalletAddr,
}: ConversationProps): JSX.Element => {
  const conversations = useAppStore((state) => state.conversations)
  const selectedConversation = conversations.get(recipientWalletAddr)
  const conversationKey = getConversationKey(selectedConversation)
  const messagesEndRef = useRef(null)
  useConversation(selectedConversation)

  const scrollToMessagesEndRef = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(messagesEndRef.current as any)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const { sendMessage } = useSendMessage(selectedConversation)

  const [endTime, setEndTime] = useState<Map<string, Date>>(new Map())

  const { convoMessages: messages, hasMore } = useGetMessages(
    conversationKey,
    endTime.get(conversationKey)
  )

  const loadingConversations = useAppStore(
    (state) => state.loadingConversations
  )

  const fetchNextMessages = useCallback(() => {
    if (hasMore && Array.isArray(messages) && messages.length > 0) {
      const lastMsgDate = messages[messages.length - 1].sent
      const currentEndTime = endTime.get(conversationKey)
      if (!currentEndTime || lastMsgDate <= currentEndTime) {
        endTime.set(conversationKey, lastMsgDate)
        setEndTime(new Map(endTime))
      }
    }
  }, [conversationKey, hasMore, messages, endTime])

  const hasMessages = Number(messages?.length) > 0

  useEffect(() => {
    if (!messages || !messagesEndRef.current) {
      return
    }
    setTimeout(() => {
      scrollToMessagesEndRef()
    }, 1000)
  }, [conversationKey, scrollToMessagesEndRef, messages])

  if (!conversationKey) {
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
    <>
      <div className="bg-white h-[82vh]">
        <div className="h-full flex justify-between flex-col">
          <MessagesList
            messagesEndRef={messagesEndRef}
            fetchNextMessages={fetchNextMessages}
            messages={messages ?? []}
            hasMore={hasMore}
          />
        </div>
      </div>
      <MessageComposer onSend={sendMessage} />
    </>
  )
}

export default React.memo(Conversation)
