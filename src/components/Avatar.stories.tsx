import { ComponentMeta } from '@storybook/react'
import React from 'react'
import { alice } from '../tests/wallets'
import Avatar from './Avatar'

export default {
  component: Avatar,
} as ComponentMeta<typeof Avatar>

export const Default = () => <Avatar peerAddress={alice.address} />
