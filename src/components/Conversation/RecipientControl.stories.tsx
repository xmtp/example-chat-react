import { ComponentMeta } from '@storybook/react'
import React from 'react'
import { alice } from '../../tests/wallets'
import RecipientControl from './RecipientControl'

export default {
  component: RecipientControl,
} as ComponentMeta<typeof RecipientControl>

export const Default = () => {
  const onSubmit = (address: string) => {
    alert(`address ${address}`)
  }
  return <RecipientControl onSubmit={onSubmit} value="" />
}

export const WithRandomAddress = () => {
  const onSubmit = (address: string) => {
    alert(`address ${address}`)
  }
  return (
    <RecipientControl
      onSubmit={onSubmit}
      value="0x4b595014f7b45789c3f4E79324aE6D8090A6C8B5"
    />
  )
}

export const WithRandomAlice = () => {
  const onSubmit = (address: string) => {
    alert(`address ${address}`)
  }
  return <RecipientControl onSubmit={onSubmit} value={alice.address} />
}
