import { Message } from '@xmtp/xmtp-js/dist/types/src'
import React, { MutableRefObject } from 'react'
import Emoji from 'react-emoji-render'
import MessageComposer from './MessageComposer'

export type ConversationViewProps = {
  messages: Message[]
  walletAddress: string | undefined
  handleSend: (message: string) => Promise<void>
  messagesEndRef: MutableRefObject<null>
}

type MessageTileProps = {
  message: Message
  isSender: boolean
}

const MessageTile = ({ message, isSender }: MessageTileProps): JSX.Element => (
  <div className={`flex justify-${isSender ? 'end' : 'start'}`}>
    <div
      className={`relative max-w-xl px-4 py-2 mb-2 ${
        isSender ? 'text-white bg-indigo-500' : 'bg-white'
      } rounded shadow`}
    >
      <span className="block">
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
  handleSend,
  messagesEndRef,
}: ConversationViewProps): JSX.Element => (
  <div className="flex flex-col flex-1 h-screen">
    <main className="flex-grow">
      <div className="pb-6">
        <div className="w-full flex flex-col">
          <div className="relative w-full p-6 overflow-y-auto flex">
            <div className="space-y-2 w-full">
              {messages?.map((msg: Message, index: number) => {
                const isSender = msg.senderAddress === walletAddress
                return (
                  <MessageTile message={msg} key={index} isSender={isSender} />
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>
    </main>
    {walletAddress && <MessageComposer handleSend={handleSend} />}
  </div>
)

export default ConversationView
