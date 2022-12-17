import React from 'react'
import { render, act } from '@testing-library/react'
import { waitFor } from '@testing-library/dom'
import Address from './Address'
import * as nextRouter from 'next/router'

// @ts-expect-error mocked next router
nextRouter.useRouter = jest.fn()

// @ts-expect-error mocked next router
nextRouter.useRouter.mockImplementation(() => ({ route: '/' }))

describe('Address', () => {
  it('renders value', () => {
    let text: string | null
    let span: Element | null
    act(() => {
      const { container } = render(<Address address={'0xfoo'} />)
      text = container.textContent
      span = container.querySelector('div > span')
    })
    waitFor(() => expect(text).toBe('0xfoo'))
    waitFor(() => expect(span).toHaveAttribute('title', '0xfoo'))
  })

  it('renders lookup', async () => {
    let text: string | null
    let span: Element | null
    act(() => {
      const { container } = render(<Address address={'0xfoo'} />)
      text = container.textContent
      span = container.querySelector('div > span')
    })
    waitFor(() => expect(text).toBe('foo.eth'))
    waitFor(() => expect(span).toHaveAttribute('title', '0xfoo'))
  })
})
