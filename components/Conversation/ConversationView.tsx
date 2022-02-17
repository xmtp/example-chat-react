import { Message } from '@xmtp/xmtp-js'
import React, { MutableRefObject } from 'react'
import Emoji from 'react-emoji-render'
import MessageComposer from './MessageComposer'
import Avatar from '../Avatar'
import { classNames, formatTime } from '../../helpers'
import Address from '../Address'

export type ConversationViewProps = {
  messages: Message[]
  walletAddress: string | undefined
  onSend: (message: string) => Promise<void>
  messagesEndRef: MutableRefObject<null>
}

type MessageTileProps = {
  message: Message
  isSender: boolean
}

type SenderAddressPillProps = {
  senderAddress: string
  userIsSender: boolean
}

const SenderAddressPill = ({
  senderAddress,
  userIsSender,
}: SenderAddressPillProps): JSX.Element => (
  <Address
    className={classNames(
      'rounded-2xl',
      'border',
      'border-2',
      'border-gray-100',
      'text-md',
      'mr-2',
      'px-3',
      'py-1',
      'font-bold',
      userIsSender ? 'bg-bt-100 text-b-600' : 'bg-zinc-50'
    )}
    address={senderAddress}
  ></Address>
)

const MessageTile = ({ message, isSender }: MessageTileProps): JSX.Element => (
  <div className="flex items-start mx-auto mb-4">
    <Avatar peerAddress={message.senderAddress as string} />
    <div className="ml-2">
      <div>
        <SenderAddressPill
          senderAddress={message.senderAddress as string}
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

const ConversationView = ({
  messages,
  walletAddress,
  onSend,
  messagesEndRef,
}: ConversationViewProps): JSX.Element => (
  <div className="flex flex-col flex-1 h-screen">
    <main className="flex-grow flex bg-white">
      <div className="pb-0 self-end">
        <div className="w-full flex flex-col">
          <div className="relative w-full px-6 pt-6 pb-14 overflow-y-auto flex">
            <div className="w-full">
              {messages?.map((msg: Message) => {
                const isSender = msg.senderAddress === walletAddress
                return (
                  <MessageTile message={msg} key={msg.id} isSender={isSender} />
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>
    </main>
    {walletAddress && <MessageComposer onSend={onSend} />}
  </div>
)

export default ConversationView
