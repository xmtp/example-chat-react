import { DecodedMessage } from '@xmtp/xmtp-js'
import React, { FC } from 'react'
import Emoji from 'react-emoji-render'
import Avatar from '../Avatar'
import { formatTime } from '../../helpers'
import AddressPill from '../AddressPill'
import InfiniteScroll from 'react-infinite-scroll-component'
import useWindowSize from '../../hooks/useWindowSize'

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

const MessageTile = ({ message }: MessageTileProps): JSX.Element => (
  <div className="flex items-start mx-auto mb-4">
    <Avatar peerAddress={message.senderAddress as string} />
    <div className="ml-2 max-w-[95%]">
      <div>
        <AddressPill address={message.senderAddress as string} />
        <span className="text-sm font-normal place-self-end text-n-300 text-md uppercase">
          {formatTime(message.sent)}
        </span>
      </div>
      <span className="block text-md px-2 mt-2 text-black font-normal break-words">
        {message.error ? (
          `Error: ${message.error?.message}`
        ) : (
          <Emoji text={message.content || ''} />
        )}
      </span>
    </div>
  </div>
)

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
