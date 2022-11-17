import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MessagesList, MessageComposer } from './'
import Loader from '../../components/Loader'
import useConversation from '../../hooks/useConversation'
import { useAppStore } from '../../store/app'
import useGetMessages from '../../hooks/useGetMessages'

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

  const [endTime, setEndTime] = useState<Map<string, Date>>(new Map())

  const { convoMessages: messages, hasMore } = useGetMessages(
    recipientWalletAddr,
    endTime.get(recipientWalletAddr)
  )

  const loadingConversations = useAppStore(
    (state) => state.loadingConversations
  )

  const fetchNextMessages = useCallback(() => {
    if (hasMore && Array.isArray(messages) && messages.length > 0) {
      const lastMsgDate = messages[messages.length - 1].sent
      const currentEndTime = endTime.get(recipientWalletAddr)
      if (!currentEndTime || lastMsgDate <= currentEndTime) {
        endTime.set(recipientWalletAddr, lastMsgDate)
        setEndTime(new Map(endTime))
      }
    }
  }, [recipientWalletAddr, hasMore, messages, endTime])

  const hasMessages = Number(messages?.length) > 0

  useEffect(() => {
    if (!messages || !messagesEndRef.current) {
      return
    }
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
