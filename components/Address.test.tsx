import React from 'react'
import { render, act } from '@testing-library/react'
import { waitFor } from '@testing-library/dom'
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
