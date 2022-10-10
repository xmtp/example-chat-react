import type { Message } from '@xmtp/xmtp-js'
import React, { Fragment, MutableRefObject } from 'react'
import Emoji from 'react-emoji-render'
import Avatar from '../Avatar'
import { formatDate, formatTime, isOnSameDay } from '../../helpers'
import Address from '../Address'
import { Flex, Divider, Text } from '@chakra-ui/react'

export type MessageListProps = {
  messages: Message[]
  messagesEndRef: MutableRefObject<null>
}

type MessageTileProps = {
  message: Message
}

const MessageTile = ({ message }: MessageTileProps): JSX.Element => (
  <Flex marginY="2">
    <Avatar peerAddress={message.senderAddress as string} />
    <Flex direction="column" marginLeft="2">
      <Flex alignItems="center">
        <Address address={message.senderAddress as string} />
        <Text marginX="2">{formatTime(message.sent)}</Text>
      </Flex>
      <Text>
        {message.error ? (
          `Error: ${message.error?.message}`
        ) : (
          <Emoji text={message.content || ''} />
        )}
      </Text>
    </Flex>
  </Flex>
)

const DateDivider = ({ date }: { date?: Date }): JSX.Element => (
  <Flex alignItems="center" justifyContent="center" marginY="2">
    <Divider />
    <Text width="full" align="center">
      {formatDate(date, { year: 'numeric', month: 'long', day: 'numeric' })}
    </Text>
    <Divider />
  </Flex>
)

const ConversationBeginningNotice = (): JSX.Element => (
  <Flex justifyContent="center" marginY="4">
    <Text>This is the beginning of the conversation</Text>
  </Flex>
)

const MessagesList = ({
  messages,
  messagesEndRef,
}: MessageListProps): JSX.Element => {
  let lastMessageDate: Date | undefined
  return (
    <Flex
      width="full"
      direction="column"
      alignSelf="end"
      padding="4"
      grow={1}
      overflowY="auto"
    >
      {messages && messages.length ? <ConversationBeginningNotice /> : null}
      {messages?.map((msg: Message) => {
        const dateHasChanged = !isOnSameDay(lastMessageDate, msg.sent)
        lastMessageDate = msg.sent
        return (
          <Fragment key={msg.id}>
            {dateHasChanged ? <DateDivider date={msg.sent} /> : null}
            <MessageTile message={msg} />
          </Fragment>
        )
      })}
      <div ref={messagesEndRef} />
    </Flex>
  )
}

export default MessagesList
