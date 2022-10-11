import { ComponentMeta } from '@storybook/react'
import { Conversation } from '@xmtp/xmtp-js'
import React from 'react'
import ConversationTile from './ConversationTile'
import { bob } from '../../tests/wallets'
import useChat from '../../hooks/useChat'

export default {
  component: ConversationTile,
} as ComponentMeta<typeof ConversationTile>

export const Default = () => {
  const { client } = useChat()
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
  const { client } = useChat()
  if (!client) return null
  return (
    <ConversationTile
      conversation={new Conversation(client, bob.address)}
      isSelected={true}
      onClick={() => alert('clicked')}
    />
  )
}
