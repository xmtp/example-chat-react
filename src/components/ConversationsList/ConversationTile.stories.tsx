import { ComponentMeta } from '@storybook/react'
import { Conversation } from '@xmtp/xmtp-js'
import React, { useContext } from 'react'
import ConversationTile from './ConversationTile'
import { XmtpContext } from '../../contexts/xmtp'
import { bob } from '../../tests/wallets'

export default {
  component: ConversationTile,
} as ComponentMeta<typeof ConversationTile>

export const Default = () => {
  const { client } = useContext(XmtpContext)
  if (!client) return null
  return (
    <ConversationTile
      conversation={new Conversation(client, bob.address)}
      isSelected={false}
      onClick={() => alert('clicked')}
    />
  )
}

export const SelectedConversation = () => {
  const { client } = useContext(XmtpContext)
  if (!client) return null
  return (
    <ConversationTile
      conversation={new Conversation(client, bob.address)}
      isSelected={true}
      onClick={() => alert('clicked')}
    />
  )
}
