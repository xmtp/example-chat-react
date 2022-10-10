import { ComponentMeta } from '@storybook/react'
import React from 'react'
import { alice } from '../tests/wallets'
import Address from './Address'

export default {
  component: Address,
} as ComponentMeta<typeof Address>

export const Default = () => (
  <Address address="0x0000000000000000000000000000000000000000" />
)

export const FromKnownAddress = () => <Address address={alice.address} />
