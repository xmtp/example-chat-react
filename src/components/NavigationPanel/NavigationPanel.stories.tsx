import { ComponentMeta } from '@storybook/react'
import React from 'react'
import NavigationPanel from '.'

export default {
  component: NavigationPanel,
} as ComponentMeta<typeof NavigationPanel>

export const Default = () => <NavigationPanel />
