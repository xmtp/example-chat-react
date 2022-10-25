import { Flex, Heading } from '@chakra-ui/react'
import { LinkIcon } from '@heroicons/react/outline'
import React from 'react'

const NoWalletConnectedMessage: React.FC = () => {
  return (
    <Flex
      justifyItems="center"
      alignItems="center"
      direction="column"
      textAlign="center"
      p={4}
    >
      <LinkIcon width="48" />
      <Heading size="lg" marginY="4">
        No wallet connected
      </Heading>
      <Heading size="sm">Please connect a wallet to begin</Heading>
    </Flex>
  )
}

export default NoWalletConnectedMessage
