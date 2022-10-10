import React from 'react'
import { LinkIcon } from '@heroicons/react/outline'
import { Flex, Heading } from '@chakra-ui/react'

const NoWalletConnectedMessage: React.FC = () => {
  return (
    <Flex
      justifyItems="center"
      alignItems="center"
      direction="column"
      textAlign="center"
    >
      <LinkIcon width="48" />
      <Heading marginY="4">No wallet connected</Heading>
      <Heading size="sm">Please connect a wallet to begin</Heading>
    </Flex>
  )
}

export default NoWalletConnectedMessage
