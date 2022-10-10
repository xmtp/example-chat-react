import { ComponentMeta } from '@storybook/react'
import React, { useContext } from 'react'
import XmtpContext from '../../contexts/xmtp'
import { bob } from '../../tests/wallets'
import Conversation from './Conversation'

export default {
  component: Conversation,
} as ComponentMeta<typeof Conversation>

export const Default = () => {
  const { setRecipient } = useContext(XmtpContext)
  setRecipient(bob.address)
  return <Conversation />
}
