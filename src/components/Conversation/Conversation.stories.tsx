import { ComponentMeta } from '@storybook/react'
import React from 'react'
import useChat from '../../hooks/useChat'
import { bob } from '../../tests/wallets'
import Conversation from './Conversation'

export default {
  component: Conversation,
} as ComponentMeta<typeof Conversation>

export const Default = () => {
  const { setRecipient } = useChat()
  setRecipient(bob.address)
  return <Conversation />
}
