import PaperAirplaneIcon from '@heroicons/react/outline/PaperAirplaneIcon'
import React, { useContext, useEffect, useState } from 'react'
import { classNames } from '../../helpers'
import XmtpContext from '../../contexts/xmtp'

type MessageComposerProps = {
  onSend: (msg: string) => Promise<void>
}

const MessageComposer = ({ onSend }: MessageComposerProps): JSX.Element => {
  const { recipient } = useContext(XmtpContext)
  const [message, setMessage] = useState('')

  useEffect(() => setMessage(''), [recipient])

  const onMessageChange = (e: React.FormEvent<HTMLInputElement>) =>
    setMessage(e.currentTarget.value)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!message) {
      return
    }
    await onSend(message)
    setMessage('')
  }

  return (
    <div
      className={classNames(
        'sticky',
        'bottom-0',
        'pl-4',
        'pt-2',
        'flex-shrink-0',
        'flex',
        'h-[68px]',
        'bg-white'
      )}
    >
      <form
        className={classNames(
          'flex',
          'w-full',
          'border',
          'py-2',
          'pl-4',
          'mr-3'
        )}
        style={{
          borderRadius: '24px',
          backgroundColor: '#fafafa',
          border: '1px solid #e5e7eb',
          height: '40px',
          padding: '10px 8px 10px 16px',
        }}
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <input
          type="text"
          placeholder="Type something..."
          className={classNames('block', 'w-full', 'text-md', 'md:text-sm')}
          style={{
            fontSize: '14px',
            border: 'none',
            background: 'none',
            paddingLeft: '0',
            marginTop: '-2.8px',
            height: '25px',
          }}
          name="message"
          value={message}
          onChange={onMessageChange}
          required
        />
        <button
          type="submit"
          style={{ marginTop: '-2.8px', width: '25px', height: '25px' }}
          disabled={!message}
        >
          <PaperAirplaneIcon
            className={`rotate-90 ${message ? 'text-b-500' : 'text-b-100'}`}
          />
        </button>
      </form>
    </div>
  )
}

export default MessageComposer
