import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { waitFor } from '@testing-library/dom'
import AddressInput from './AddressInput'
import assert from 'assert'

describe('AddressInput', () => {
  it('renders empty input when there is no recipient address', () => {
    const { container } = render(<AddressInput />)
    expect(container.querySelector('input')).toHaveAttribute('value', '')
    expect(container.querySelector('div > span')).toBeFalsy()
  })

  it('renders address pill when there is a recipient address', () => {
    const { container } = render(
      <AddressInput recipientWalletAddress="0xfoo" />
    )
    expect(container.querySelector('div > span')).toBeVisible()
    expect(container.querySelector('input')).toBeFalsy()
  })

  it('renders address pill for resolved input value', async () => {
    const rerenderWithInputValue = (value: string) =>
      rerender(
        <AddressInput
          recipientWalletAddress={value}
          resolveName={async (name: string) =>
            name === 'foo.eth' ? '0xfoo' : undefined
          }
          lookupAddress={async (address: string) =>
            address === '0xfoo' ? 'foo.eth' : undefined
          }
          setRecipientInputMode={(RecipientInputMode: number) =>
            RecipientInputMode
          }
          submitAddress={(address: string) => address}
        />
      )
    const { container, rerender } = render(
      <AddressInput
        resolveName={async (name: string) =>
          name === 'foo.eth' ? '0xfoo' : undefined
        }
        lookupAddress={async (address: string) =>
          address === '0xfoo' ? 'foo.eth' : undefined
        }
        setRecipientInputMode={(RecipientInputMode: number) =>
          RecipientInputMode
        }
        submitAddress={rerenderWithInputValue}
      />
    )
    const input = container.querySelector('input')
    assert.ok(input)
    expect(input).toHaveAttribute('value', '')
    expect(container.querySelector('div > span')).toBeFalsy()
    fireEvent.change(input, { target: { value: 'foo.eth' } })
    expect(input).toHaveAttribute('value', 'foo.eth')
    await waitFor(() =>
      expect(container.querySelector('div > span')).toBeVisible()
    )
    expect(container.querySelector('input')).toBeFalsy()
  })
})
