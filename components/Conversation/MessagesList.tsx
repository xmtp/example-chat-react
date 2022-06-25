import { Message } from '@xmtp/xmtp-js'
import React, { MutableRefObject, useEffect, useState } from 'react'
import Emoji from 'react-emoji-render'
import Avatar from '../Avatar'
import { formatTime } from '../../helpers'
import AddressPill from '../AddressPill'
import axios from 'axios'

export type MessageListProps = {
  messages: Message[]
  walletAddress: string | undefined
  messagesEndRef: MutableRefObject<null>
}

type MessageTileProps = {
  message: Message
  isSender: boolean
  isHacked: boolean
}

const isOnSameDay = (d1?: Date, d2?: Date): boolean => {
  return d1?.toDateString() === d2?.toDateString()
}

const formatDate = (d?: Date) =>
  d?.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

const MessageTile = ({
  message,
  isSender,
  isHacked,
}: MessageTileProps): JSX.Element => (
  <div className="flex items-start mx-auto mb-4">
    <Avatar peerAddress={message.senderAddress as string} />
    <div className="ml-2">
      <div>
        <AddressPill
          address={message.senderAddress as string}
          userIsSender={isSender}
          isHacked={isHacked}
        />
        <span className="text-sm font-normal place-self-end text-n-300 text-md uppercase">
          {formatTime(message.sent)}
        </span>
      </div>
      <span className="block text-md px-2 mt-2 text-black font-normal">
        {message.error ? (
          `Error: ${message.error?.message}`
        ) : (
          <Emoji text={message.content || ''} />
        )}
      </span>
    </div>
  </div>
)

const DateDividerBorder: React.FC = ({ children }) => (
  <>
    <div className="grow h-0.5 bg-gray-300/25" />
    {children}
    <div className="grow h-0.5 bg-gray-300/25" />
  </>
)

const DateDivider = ({ date }: { date?: Date }): JSX.Element => (
  <div className="flex align-items-center items-center pb-8 pt-4">
    <DateDividerBorder>
      <span className="mx-11 flex-none text-gray-300 text-sm font-bold">
        {formatDate(date)}
      </span>
    </DateDividerBorder>
  </div>
)

const ConversationBeginningNotice = (): JSX.Element => (
  <div className="flex align-items-center justify-center pb-4">
    <span className="text-gray-300 text-sm font-semibold">
      This is the beginning of the conversation
    </span>
  </div>
)

export type IsBurnedResponse = {
  msg?: string
  hacked?: boolean
}

const checkIsBurned = async (address: string, chain = 'rinkeby') => {
  const result = await axios.get(
    `https://burnmywallet.com/api/isBurned?address=${address}&chain=${chain}`
  )
  console.log('handleSearch after api call', result.data)

  const data = result.data as IsBurnedResponse

  return data.hacked
}

const MessagesList = ({
  messages,
  walletAddress,
  messagesEndRef,
}: MessageListProps): JSX.Element => {
  let lastMessageDate: Date | undefined
  const [isHacked, setIsHacked] = useState(false)

  const isHackedEffect = async (senderAddress: string) => {
    const result = await checkIsBurned(senderAddress)
    if (result) {
      setIsHacked(result)
    }
  }

  useEffect(() => {
    messages[0] && isHackedEffect(messages[0].senderAddress as string)
  }, [])

  return (
    <div className="flex-grow flex">
      <div className="pb-6 md:pb-0 w-full flex flex-col self-end">
        <div className="relative w-full bg-white px-4 pt-6 overflow-y-auto flex">
          <div className="w-full">
            {messages && messages.length ? (
              <ConversationBeginningNotice />
            ) : null}
            {messages?.map((msg: Message) => {
              const isSender = msg.senderAddress === walletAddress
              const tile = (
                <MessageTile
                  message={msg}
                  key={msg.id}
                  isSender={isSender}
                  isHacked={isHacked}
                />
              )
              const dateHasChanged = !isOnSameDay(lastMessageDate, msg.sent)
              lastMessageDate = msg.sent
              return dateHasChanged ? (
                <div key={msg.id}>
                  <DateDivider date={msg.sent} />
                  {tile}
                </div>
              ) : (
                tile
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  )
}
export default MessagesList
