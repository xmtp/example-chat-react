import { ComponentMeta } from '@storybook/react'
import React from 'react'
import ConversationsList from './'

export default {
  component: ConversationsList,
} as ComponentMeta<typeof ConversationsList>

export const Default = () => <ConversationsList />
