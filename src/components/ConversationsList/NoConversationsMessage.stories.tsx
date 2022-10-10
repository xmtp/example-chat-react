import { ComponentMeta } from '@storybook/react'
import React from 'react'
import NoConversationsMessage from './NoConversationsMessage'

export default {
  component: NoConversationsMessage,
} as ComponentMeta<typeof NoConversationsMessage>

export const Default = () => <NoConversationsMessage />
