import { Message } from '@xmtp/xmtp-js'
import React, { MutableRefObject } from 'react'
import Emoji from 'react-emoji-render'
import MessageComposer from './MessageComposer'
import Avatar from '../Avatar'
import { classNames, formatDate } from '../../helpers'
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
      'rounded-lg',
      'border',
      'border-2',
      'border-gray-100',
      'bg-white',
      'text-m',
      'p-2',
      userIsSender ? 'bg-bt-100 text-b-600' : null
    )}
    address={senderAddress}
  ></Address>
)

const MessageTile = ({ message, isSender }: MessageTileProps): JSX.Element => (
  <div className="flex justify-start">
    <Avatar peerAddress={message.senderAddress as string} />
    <div>
      <SenderAddressPill
        senderAddress={message.senderAddress as string}
        userIsSender={isSender}
      />
      <span className="text-s font-normal place-self-end text-n-300">
        {formatDate(message.sent)}
      </span>
    </div>
    <span className="block">
      {message.error ? (
        `Error: ${message.error?.message}`
      ) : (
        <Emoji text={message.text || ''} />
      )}
    </span>
  </div>
)

const ConversationView = ({
  messages,
  walletAddress,
  onSend,
  messagesEndRef,
}: ConversationViewProps): JSX.Element => (
  <div className="flex flex-col flex-1 h-screen bg-white">
    <main className="flex-grow">
      <div className="pb-6">
        <div className="w-full flex flex-col">
          <div className="relative w-full p-6 overflow-y-auto flex">
            <div className="space-y-2 w-full">
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
