import { classNames, truncate, formatDate } from '../helpers'
import Link from 'next/link'
import Address from './Address'
import { useRouter } from 'next/router'
import { Conversation } from '@xmtp/xmtp-js/dist/types/src/conversations'
import useConversation from '../hooks/useConversation'
import { Message } from '@xmtp/xmtp-js'
import useWallet from '../hooks/useWallet'
import Avatar from './Avatar'

type ConversationsListProps = {
  conversations: Conversation[]
}

type ConversationTileProps = {
  conversation: Conversation
  isSelected: boolean
  onClick?: () => void
}

const getLatestMessage = (messages: Message[]): Message | null =>
  messages.length ? messages[messages.length - 1] : null

const ConversationTile = ({
  conversation,
  isSelected,
  onClick,
}: ConversationTileProps): JSX.Element => {
  const { lookupAddress } = useWallet()
  const { messages } = useConversation(conversation.peerAddress)
  const latestMessage = getLatestMessage(messages)
  const path = `/dm/${conversation.peerAddress}`
  return (
    <Link href={path} key={conversation.peerAddress}>
      <a onClick={onClick}>
        <div
          className={classNames(
            'h-20',
            'py-2',
            'px-4',
            'md:max-w-sm',
            'mx-auto',
            'bg-white',
            'space-y-2',
            'py-2',
            'flex',
            'items-center',
            'space-y-0',
            'space-x-4',
            'border-b-2',
            'border-gray-100',
            'hover:bg-bt-100',
            isSelected ? 'bg-bt-200' : null
          )}
        >
          <Avatar peerAddress={conversation.peerAddress} />
          <div className="py-4 sm:text-left text w-full">
            <div className="grid-cols-2 grid">
              <Address
                address={conversation.peerAddress}
                className="text-black text-sm font-bold place-self-start"
                lookupAddress={lookupAddress}
              />
              <span className="text-sm font-normal place-self-end text-n-300">
                {formatDate(latestMessage?.sent)}
              </span>
            </div>
            <p className="text-sm font-normal text-ellipsis mt-0">
              {latestMessage && truncate(latestMessage.text, 75)}
            </p>
          </div>
        </div>
      </a>
    </Link>
  )
}

const ConversationsList = ({
  conversations,
}: ConversationsListProps): JSX.Element => {
  const router = useRouter()

  return (
    <div>
      {conversations &&
        conversations.map((convo) => {
          const isSelected =
            router.query.recipientWalletAddr == convo.peerAddress
          return (
            <ConversationTile
              key={convo.peerAddress}
              conversation={convo}
              isSelected={isSelected}
            />
          )
        })}
    </div>
  )
}

export default ConversationsList
