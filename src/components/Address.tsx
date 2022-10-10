import { Heading } from '@chakra-ui/react'
import React from 'react'
import { shortAddress } from '../helpers'
import useLookup from '../hooks/useLookup'

type AddressProps = {
  address: string
}

const Address = ({ address }: AddressProps): JSX.Element => {
  const { data } = useLookup(address)
  return (
    <Heading as="h4" size="sm">
      {data.name || shortAddress(address)}
    </Heading>
  )
}

export default Address
