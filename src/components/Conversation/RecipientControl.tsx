import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react'
import { getAddress } from '@ethersproject/address'
import React, { useCallback, useEffect, useState } from 'react'
import { shortAddress } from '../../helpers'
import useChat from '../../hooks/useChat'
import useLookup from '../../hooks/useLookup'

type RecipientInputProps = {
  value: string | undefined
  onSubmit: (address: string) => void
}

const RecipientControl = ({
  value,
  onSubmit,
}: RecipientInputProps): JSX.Element => {
  const { client } = useChat()
  const {
    data: { name },
  } = useLookup(value)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    if (value) setError(undefined)
    return () => setError(undefined)
  }, [value])

  const handleInputChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.value.startsWith('0x'))
        return setError(new Error('Please enter a valid wallet address'))
      if (e.target.value.length !== 42)
        return setError(new Error('Please enter a valid wallet address'))

      const address = getAddress(e.target.value)
      const onNetwork = client ? await client.canMessage(address) : false
      if (!onNetwork)
        return setError(new Error('Recipient is not on the XMTP network'))

      onSubmit(address)
      e.target.blur()
    },
    [onSubmit, client]
  )

  return (
    <FormControl isInvalid={!!error} overflow="hidden">
      <Flex alignItems="center">
        <FormLabel htmlFor="recipient" marginBottom={0}>
          To:
        </FormLabel>
        {!value ? (
          <Input
            id="recipient"
            type="recipient"
            onChange={handleInputChange}
            variant="unstyled"
            autoFocus
          />
        ) : (
          <Text title={name || value} isTruncated>
            {name || shortAddress(value)}
          </Text>
        )}
      </Flex>
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  )
}

export default RecipientControl
