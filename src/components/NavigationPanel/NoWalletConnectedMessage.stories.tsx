import { ComponentMeta } from '@storybook/react'
import React from 'react'
import NoWalletConnectedMessage from './NoWalletConnectedMessage'

export default {
  component: NoWalletConnectedMessage,
} as ComponentMeta<typeof NoWalletConnectedMessage>

export const Default = () => <NoWalletConnectedMessage />
