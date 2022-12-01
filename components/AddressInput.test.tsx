import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import { waitFor } from '@testing-library/dom'
import AddressInput from './AddressInput'
import * as nextRouter from 'next/router'

// @ts-expect-error mocked next router
nextRouter.useRouter = jest.fn()

// @ts-expect-error mocked next router
nextRouter.useRouter.mockImplementation(() => ({ route: '/' }))

describe('AddressInput', () => {
  it('renders no initial value', () => {
    let input: HTMLInputElement | null
    act(() => {
      const { container } = render(<AddressInput />)
      input = container.querySelector('input')
    })
    waitFor(() => expect(input).toHaveAttribute('value', ''))
  })

  it('renders initial value', () => {
    let input: HTMLInputElement | null
    act(() => {
      const { container } = render(
        <AddressInput recipientWalletAddress={'0xfoo.eth'} />
      )
      input = container.querySelector('input')
    })
    waitFor(() => expect(input).toHaveAttribute('value', '0xfoo.eth'))
  })

  it('renders lookup for initial value', async () => {
    let input: HTMLInputElement | null
    act(() => {
      const { container } = render(
        <AddressInput recipientWalletAddress={'0xfoo'} />
      )
      input = container.querySelector('input')
    })
    waitFor(() => expect(input).toHaveAttribute('value', 'foo.eth'))
  })

  it('renders lookup for changed value', async () => {
    let input: HTMLInputElement | null
    act(() => {
      const rerenderWithInputValue = (value: string) =>
        rerender(<AddressInput recipientWalletAddress={value} />)
      const { container, rerender } = render(
        <AddressInput
          recipientWalletAddress={'0xbar'}
          onInputChange={async (event: React.SyntheticEvent) => {
            const data = event.target as typeof event.target & {
              value: string
            }
            rerenderWithInputValue(data.value)
          }}
        />
      )
      input = container.querySelector('input')
      input && fireEvent.change(input, { target: { value: '0xfoo' } })
    })
    waitFor(() => expect(input).toHaveAttribute('value', 'foo.eth'))
  })
})
