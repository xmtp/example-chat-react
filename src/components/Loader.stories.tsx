import { ComponentMeta } from '@storybook/react'
import React from 'react'
import Loader from './Loader'

export default {
  component: Loader,
} as ComponentMeta<typeof Loader>

export const Default = () => (
  <Loader headingText="heading text" subHeadingText="subheading text" />
)
