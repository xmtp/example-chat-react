import { ComponentMeta } from '@storybook/react'
import React from 'react'
import MessageComposer from './MessageComposer'

export default {
  component: MessageComposer,
} as ComponentMeta<typeof MessageComposer>

export const Default = () => {
  const onSend = async (message: string) => {
    alert(`message ${message}`)
  }
  return <MessageComposer onSend={onSend} />
}
