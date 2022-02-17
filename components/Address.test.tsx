import React from 'react'
import { render, screen } from '@testing-library/react'
import Address from './Address'

describe('Address', () => {
  it('renders value', () => {
    const { container } = render(<Address address={'0xfoo'} />)
    expect(container.textContent).toBe('0xfoo')
    expect(container.querySelector('div > span')).toHaveAttribute(
      'title',
      '0xfoo'
    )
  })

  it('renders lookup', async () => {
    const { container } = render(
      <Address
        address={'0xfoo'}
        lookupAddress={async (address: string) =>
          address === '0xfoo' ? 'foo.eth' : undefined
        }
      />
    )
    await screen.findByText('foo.eth')
    expect(container.textContent).toBe('foo.eth')
    expect(container.querySelector('div > span')).toHaveAttribute(
      'title',
      '0xfoo'
    )
  })
})
