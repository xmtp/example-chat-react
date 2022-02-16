import { classNames, truncate } from '../../helpers'
import Link from 'next/link'
import Address from '../Address'
import { useRouter } from 'next/router'
import { Conversation } from '@xmtp/xmtp-js/dist/types/src/conversations'
import Blockies from 'react-blockies'
import useConversation from '../../hooks/useConversation'
import { Message } from '@xmtp/xmtp-js'

type ConversationListProps = {
  conversations: Conversation[]
}

type ConversationTileProps = {
  conversation: Conversation
  isSelected: boolean
}

type AvatarBlockProps = {
  peerAddress: string
}

const getLatestMessage = (messages: Message[]): Message | null =>
  messages.length ? messages[messages.length - 1] : null

const AvatarBlock = ({ peerAddress }: AvatarBlockProps) => (
  <Blockies seed={peerAddress} size={10} className="rounded-full" />
)

const formatDate = (d: Date | undefined): string =>
  d ? d.toLocaleDateString('en-US') : ''

const ConversationTile = ({
  conversation,
  isSelected,
}: ConversationTileProps): JSX.Element => {
  const { messages } = useConversation(conversation.peerAddress)
  const latestMessage = getLatestMessage(messages)
  const path = `/dm/${conversation.peerAddress}`
  return (
    <Link href={path} key={conversation.peerAddress}>
      <a>
        <div
          className={classNames(
            'py-2',
            'px-4',
            'max-w-sm',
            'mx-auto',
            'bg-white',
            'space-y-2',
            'sm:py-2',
            'sm:flex',
            'sm:items-center',
            'sm:space-y-0',
            'sm:space-x-4',
            'border-b-0',
            'border-gray-100',
            isSelected ? 'bg-bt-200' : null
          )}
        >
          <AvatarBlock peerAddress={conversation.peerAddress} />
          <div className="text-center space-y-1 py-1 sm:text-left text w-full">
            <div className="grid-cols-2 grid">
              <Address
                address={conversation.peerAddress}
                className="text-black text-s font-bold place-self-start"
              />
              <span className="text-s font-normal place-self-end text-n-300">
                {formatDate(latestMessage?.sent)}
              </span>
            </div>
            <p className="text-s font-normal text-ellipsis mt-0">
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
}: ConversationListProps): JSX.Element => {
  const router = useRouter()

  return (
    <>
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
    </>
  )
}

export default ConversationsList
