import { Message } from '@xmtp/xmtp-js'
import React, { MutableRefObject } from 'react'
import Emoji from 'react-emoji-render'
import Avatar from '../Avatar'
import { formatTime } from '../../helpers'
import AddressPill from '../AddressPill'

export type MessageListProps = {
  messages: Message[]
  walletAddress: string | undefined
  messagesEndRef: MutableRefObject<null>
}

type MessageTileProps = {
  message: Message
  isSender: boolean
}

const isOnSameDay = (d1?: Date, d2?: Date): boolean => {
  return d1?.toDateString() === d2?.toDateString()
}

const MessageTile = ({ message, isSender }: MessageTileProps): JSX.Element => (
  <div className="flex items-start mx-auto mb-4">
    <Avatar peerAddress={message.senderAddress as string} />
    <div className="ml-2">
      <div>
        <AddressPill
          address={message.senderAddress as string}
          userIsSender={isSender}
        />
        <span className="text-sm font-normal place-self-end text-n-300 text-md uppercase">
          {formatTime(message.sent)}
        </span>
      </div>
      <span className="block text-md px-2 mt-2 text-black font-normal">
        {message.error ? (
          `Error: ${message.error?.message}`
        ) : (
          <Emoji text={message.text || ''} />
        )}
      </span>
    </div>
  </div>
)

const DateDividerBorder: React.FC = ({ children }) => (
  <>
    <div className="grow h-px bg-gray-300" />
    {children}
    <div className="grow h-px bg-gray-300" />
  </>
)

const DateDivider = ({ date }: { date?: Date }): JSX.Element => (
  <div className="flex align-items-center items-center py-8">
    <DateDividerBorder>
      <span className="mx-8 flex-none">{date?.toDateString()}</span>
    </DateDividerBorder>
  </div>
)

const MessagesList = ({
  messages,
  walletAddress,
  messagesEndRef,
}: MessageListProps): JSX.Element => {
  let lastMessageDate: Date | undefined

  return (
    <div className="flex-grow flex">
      <div className="pb-6 md:pb-0 w-full flex flex-col self-end">
        <div className="relative w-full bg-white px-4 pt-6 overflow-y-auto flex">
          <div className="w-full">
            {messages?.map((msg: Message) => {
              const isSender = msg.senderAddress === walletAddress
              const tile = (
                <MessageTile message={msg} key={msg.id} isSender={isSender} />
              )
              const dateHasChanged = !isOnSameDay(lastMessageDate, msg.sent)
              lastMessageDate = msg.sent
              return dateHasChanged
                ? [<DateDivider date={msg.sent} key={msg.id} />, tile]
                : tile
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  )
}
export default MessagesList
