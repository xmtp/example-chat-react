import React, { useCallback, useState } from 'react'
import { classNames } from '../../helpers'
import messageComposerStyles from '../../styles/MessageComposer.module.scss'
import upArrowGreen from '../../public/up-arrow-green.svg'
import upArrowGrey from '../../public/up-arrow-grey.svg'
import { ConversationViewProps } from './ConversationView'

type MessageComposerProps = Pick<ConversationViewProps, 'handleSend'>

const MessageComposer = ({ handleSend }: MessageComposerProps): JSX.Element => {
  const [message, setMessage] = useState('')
  const onMessageChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => setMessage(e.currentTarget.value),
    []
  )
  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!message) {
        return
      }
      await handleSend(message)
      setMessage('')
    },
    [handleSend, message]
  )
  return (
    <div
      className={classNames(
        'sticky',
        'bottom-0',
        'z-10',
        'flex-shrink-0',
        'flex',
        'h-16',

        messageComposerStyles.container
      )}
    >
      <form
        className={classNames(
          'flex',
          'w-full',
          'border',
          'py-2',
          'pl-4',
          'mr-3',
          messageComposerStyles.bubble
        )}
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <input
          type="text"
          placeholder="Type something..."
          className={classNames(
            'block',
            'w-full',
            'sm:text-sm',
            messageComposerStyles.input
          )}
          name="message"
          value={message}
          onChange={onMessageChange}
          required
        />
        <button type="submit" className={messageComposerStyles.arrow}>
          <img
            src={message ? upArrowGreen : upArrowGrey}
            alt="send"
            height={32}
            width={32}
          />
        </button>
      </form>
    </div>
  )
}

export default MessageComposer
