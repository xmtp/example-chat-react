import React, { useEffect, useState } from 'react'
import { classNames } from '../../helpers'
import messageComposerStyles from '../../styles/MessageComposer.module.css'
import upArrowGreen from '../../public/up-arrow-green.svg'
import upArrowGrey from '../../public/up-arrow-grey.svg'
import { useRouter } from 'next/router'
import { AudioRecorder } from 'react-audio-voice-recorder'
import Image from 'next/image'

type MessageComposerProps = {
  onSend: (msg: object) => Promise<void>
}

type Message = { content: string | ArrayBuffer; contentType: string }

const MessageComposer = ({ onSend }: MessageComposerProps): JSX.Element => {
  const [message, setMessage] = useState<Message>({
    content: '',
    contentType: '',
  })

  const router = useRouter()

  useEffect(
    () => setMessage({ ...message, content: '' }),
    [router.query.recipientWalletAddr]
  )

  const onMessageChange = (e: React.FormEvent<HTMLInputElement>) => {
    setMessage({ ...message, content: e.currentTarget.value })
  }

  const addAudioElement = (blob: Blob) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    return new Promise(() => {
      reader.onloadend = () => {
        if (reader.result !== null) {
          setMessage({
            ...message,
            content: reader.result,
            contentType: 'voiceMemo',
          })
        }
      }
    })
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const contentMessage = message.content

    if (!contentMessage) {
      return
    }
    setMessage({ ...message, content: '', contentType: '' })
    await onSend(message)
  }

  return (
    <div className={classNames('bg-white', 'flex', 'items-center')}>
      <form
        className={classNames(
          'flex',
          'm-2',
          'w-full',
          'border',
          'py-2',
          'pl-4',
          'mr-3',
          'drop-shadow-xl',
          'mt-0',
          messageComposerStyles.bubble
        )}
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <AudioRecorder onRecordingComplete={addAudioElement} />
        <input
          type="text"
          placeholder="Type something..."
          className={classNames(
            'block',
            'w-full',
            'text-md',
            'md:text-sm',

            messageComposerStyles.input
          )}
          name="message"
          value={message.content}
          onChange={onMessageChange}
          required
        />
        <button type="submit" className={messageComposerStyles.arrow}>
          {!message ? (
            <Image src={upArrowGrey} alt="send" height={32} width={32} />
          ) : (
            <Image src={upArrowGreen} alt="send" height={32} width={32} />
          )}
        </button>
      </form>
    </div>
  )
}

export default MessageComposer
