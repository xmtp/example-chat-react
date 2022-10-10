import React from 'react'
import { useState, useContext, useCallback, useEffect } from 'react'
import XmtpContext from '../../contexts/xmtp'
import useLookup from '../../hooks/useLookup'
import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react'

type RecipientInputProps = {
  value: string | undefined
  onSubmit: (address: string) => void
}

const RecipientControl = ({
  value,
  onSubmit,
}: RecipientInputProps): JSX.Element => {
  const { client } = useContext(XmtpContext)
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
      const address = e.target.value
      if (!address.startsWith('0x'))
        return setError(new Error('Please enter a valid wallet address'))
      if (address.length !== 42)
        return setError(new Error('Please enter a valid wallet address'))

      const onNetwork = client ? await client.canMessage(address) : false
      if (!onNetwork)
        return setError(new Error('Recipient is not on the XMTP network'))

      onSubmit(address)
      e.target.blur()
    },
    [onSubmit, client]
  )

  return (
    <FormControl isInvalid={!!error}>
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
          <Text>{name || value}</Text>
        )}
      </Flex>
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  )
}

export default RecipientControl
