import { Divider, Flex, LinkBox, LinkOverlay, Text } from '@chakra-ui/react'
import type { Conversation } from '@xmtp/xmtp-js'
import React from 'react'
import Emoji from 'react-emoji-render'
import { formatDate, truncate } from '../../helpers'
import useConversation from '../../hooks/useConversation'
import Address from '../Address'
import Avatar from '../Avatar'

type ConversationTileProps = {
  conversation: Conversation
  isSelected: boolean
  onClick?: () => void
}

// TODO: add design for `isSelected`
const ConversationTile = ({
  conversation,
  isSelected,
  onClick,
}: ConversationTileProps): JSX.Element | null => {
  const { messages } = useConversation(conversation.peerAddress)

  const latestMessage = messages.length ? messages[messages.length - 1] : null

  return (
    <LinkBox key={conversation.peerAddress}>
      <Flex width="full" paddingX={3} paddingY={4}>
        <Avatar peerAddress={conversation.peerAddress} />
        <Flex direction="column" width="full" marginLeft="2">
          <Flex justifyContent="space-between" alignItems="center" width="full">
            <LinkOverlay onClick={onClick} cursor="pointer">
              <Address address={conversation.peerAddress} />
            </LinkOverlay>
            <Text>{latestMessage ? formatDate(latestMessage.sent) : '-'}</Text>
          </Flex>
          <Text>
            <Emoji
              text={
                latestMessage
                  ? truncate(latestMessage.content, 75)
                  : 'loading...'
              }
            />
          </Text>
        </Flex>
      </Flex>
      <Divider />
    </LinkBox>
  )
}

export default ConversationTile
