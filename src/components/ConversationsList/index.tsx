import React, { useContext } from 'react'
import type { Conversation, Message } from '@xmtp/xmtp-js'
import useMessageStore from '../../hooks/useMessageStore'
import XmtpContext from '../../contexts/xmtp'
import NoConversationsMessage from './NoConversationsMessage'
import ConversationTile from './ConversationTile'
import Loader from '../Loader'

const getLatestMessage = (messages: Message[]): Message | null =>
  messages?.length ? messages[messages.length - 1] : null

const ConversationsList = (): JSX.Element => {
  const { conversations, recipient, setRecipient, loadingConversations } =
    useContext(XmtpContext)
  const { messageStore } = useMessageStore()

  const orderByLatestMessage = (
    convoA: Conversation,
    convoB: Conversation
  ): number => {
    const convoAMessages = messageStore[convoA.peerAddress]
    const convoBMessages = messageStore[convoB.peerAddress]
    const convoALastMessageDate =
      getLatestMessage(convoAMessages)?.sent || new Date()
    const convoBLastMessageDate =
      getLatestMessage(convoBMessages)?.sent || new Date()
    return convoALastMessageDate < convoBLastMessageDate ? 1 : -1
  }

  if (loadingConversations) {
    return (
      <Loader
        headingText="Loading conversations..."
        subHeadingText="Please wait a moment"
      />
    )
  }
  if (!conversations || conversations.size == 0) {
    return <NoConversationsMessage />
  }

  return (
    <nav>
      {conversations &&
        conversations.size > 0 &&
        Array.from(conversations.values())
          .sort(orderByLatestMessage)
          .map((convo) => {
            const isSelected = recipient == convo.peerAddress
            return (
              <ConversationTile
                key={convo.peerAddress}
                conversation={convo}
                isSelected={isSelected}
                onClick={() => setRecipient(convo.peerAddress)}
              />
            )
          })}
    </nav>
  )
}

export default ConversationsList
