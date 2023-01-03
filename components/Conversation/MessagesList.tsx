import { DecodedMessage } from '@xmtp/xmtp-js'
import React, { FC } from 'react'
import Emoji from 'react-emoji-render'
import Avatar from '../Avatar'
import { formatTime } from '../../helpers'
import InfiniteScroll from 'react-infinite-scroll-component'
import useWindowSize from '../../hooks/useWindowSize'
import { useAppStore } from './../../store/app'

export type MessageListProps = {
  messages: DecodedMessage[]
  fetchNextMessages: () => void
  hasMore: boolean
}

type MessageTileProps = {
  message: DecodedMessage
}

const isOnSameDay = (d1?: Date, d2?: Date): boolean => {
  return d1?.toDateString() === d2?.toDateString()
}

const formatDate = (d?: Date) =>
  d?.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

const MessageTile = ({ message }: MessageTileProps): JSX.Element => {
  const { address } = useAppStore()
  const messageFromMe = (): boolean => address === message.senderAddress

  return (
    <>
      <div className="chat-message">
        <div
          className={`flex items-end mb-4 ${
            messageFromMe() && 'justify-end mr-4'
          }`}
        >
          <div
            className={`flex flex-col space-y-2 text-xs max-w-xs mx-2 order-${
              messageFromMe() ? 1 : 2
            } items-end`}
          >
            <div className="relative">
              <span
                className={`px-3 py-2 rounded-lg inline-block ${
                  messageFromMe()
                    ? 'rounded-br-none bg-blue-600 text-white'
                    : 'rounded-bl-none  bg-gray-300 text-gray-600'
                } text-md`}
              >
                {message.error ? (
                  `Error: ${message.error?.message}`
                ) : (
                  <Emoji text={message.content || ''} />
                )}
                <span className="block w-fit text-xs ml-auto py-1">
                  {formatTime(message.sent)}
                </span>
              </span>
            </div>
          </div>
          <div className={`order-${messageFromMe() ? 2 : 1}`}>
            <Avatar
              minimal={true}
              peerAddress={message.senderAddress as string}
            />
          </div>
        </div>
      </div>
    </>
  )
}

const DateDividerBorder: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => (
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
  <div className="flex align-items-center justify-center pb-4 mt-4">
    <span className="text-gray-300 text-sm font-semibold">
      This is the beginning of the conversation
    </span>
  </div>
)

const LoadingMore: FC = () => (
  <div className="p-1 mt-6 text-center text-gray-300 font-bold text-sm">
    Loading Messages...
  </div>
)

const MessagesList = ({
  messages,
  fetchNextMessages,
  hasMore,
}: MessageListProps): JSX.Element => {
  let lastMessageDate: Date | undefined
  const size = useWindowSize()

  return (
    <InfiniteScroll
      dataLength={messages.length}
      next={fetchNextMessages}
      className="flex flex-col-reverse overflow-y-auto pl-4"
      height={size[1] > 700 ? '87vh' : '83vh'}
      inverse
      endMessage={<ConversationBeginningNotice />}
      hasMore={hasMore}
      loader={<LoadingMore />}
    >
      {messages?.map((msg: DecodedMessage, index: number) => {
        const dateHasChanged = lastMessageDate
          ? !isOnSameDay(lastMessageDate, msg.sent)
          : false
        const messageDiv = (
          <div key={`${msg.id}_${index}`}>
            <MessageTile message={msg} />
            {dateHasChanged ? <DateDivider date={lastMessageDate} /> : null}
          </div>
        )
        lastMessageDate = msg.sent
        return messageDiv
      })}
    </InfiniteScroll>
  )
}

export default React.memo(MessagesList)
