import React from 'react'
import { Flex, Heading } from '@chakra-ui/react'

const NoConversationsMessage = (): JSX.Element => {
  return (
    <Flex
      justifyItems="center"
      alignItems="center"
      direction="column"
      textAlign="center"
    >
      <Heading marginY="4">Your message list is empty</Heading>
      <Heading size="sm">There are no messages for this address</Heading>
    </Flex>
  )
}

export default NoConversationsMessage
