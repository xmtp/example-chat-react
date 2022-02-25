import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import { waitFor } from '@testing-library/dom'
import AddressInput from './AddressInput'
import assert from 'assert'

const lookupAddress = async (address: string) =>
  address === '0xfoo' ? 'foo.eth' : undefined

describe('AddressInput', () => {
  it('renders no initial value', () => {
    act(() => {
      const { container } = render(<AddressInput />)
      expect(container.querySelector('input')).toHaveAttribute('value', '')
    })
  })

  it('renders initial value', () => {
    act(() => {
      const { container } = render(
        <AddressInput recipientWalletAddress={'0xfoo'} />
      )
      expect(container.querySelector('input')).toHaveAttribute('value', '0xfoo')
    })
  })

  it('renders lookup for initial value', async () => {
    act(() => {
      const { container } = render(
        <AddressInput
          recipientWalletAddress={'0xfoo'}
          lookupAddress={lookupAddress}
        />
      )
      const input = container.querySelector('input')
      waitFor(() => expect(input).toHaveAttribute('value', 'foo.eth'))
    })
  })

  it('renders lookup for changed value', async () => {
    act(() => {
      const rerenderWithInputValue = (value: string) =>
        rerender(
          <AddressInput
            recipientWalletAddress={value}
            lookupAddress={lookupAddress}
          />
        )
      const { container, rerender } = render(
        <AddressInput
          recipientWalletAddress={'0xbar'}
          lookupAddress={lookupAddress}
          onInputChange={async (event: React.SyntheticEvent) => {
            const data = event.target as typeof event.target & {
              value: string
            }
            rerenderWithInputValue(data.value)
          }}
        />
      )
      const input = container.querySelector('input')
      assert.ok(input)
      expect(input).toHaveAttribute('value', '0xbar')
      fireEvent.change(input, { target: { value: '0xfoo' } })
      waitFor(() => expect(input).toHaveAttribute('value', 'foo.eth'))
    })
  })
})
