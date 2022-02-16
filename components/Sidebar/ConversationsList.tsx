// import { classNames } from '../../helpers'
// import Link from 'next/link'
// import { InboxInIcon } from '@heroicons/react/outline'
import Address from '../Address'
import { useRouter } from 'next/router'
import { Conversation } from '@xmtp/xmtp-js/dist/types/src/conversations'
import Blockies from 'react-blockies'
import conversationTileStyles from '../../styles/ConversationTile.module.scss'
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
  <Blockies seed={peerAddress} size={10} />
)

const ConversationTile = ({
  conversation,
  isSelected,
}: ConversationTileProps): JSX.Element => {
  const { messages } = useConversation(conversation.peerAddress)
  const latestMessage = getLatestMessage(messages)
  return (
    <div className="py-2 px-2 max-w-sm mx-auto bg-white space-y-2 sm:py-2 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
      <div className={conversationTileStyles.blockie}>
        <AvatarBlock peerAddress={conversation.peerAddress} />
      </div>
      <div className="text-center space-y-2 sm:text-left">
        <div className="space-y-0.5">
          <Address
            address={conversation.peerAddress}
            className="text-black text-sm"
          />
          <p className="text-sm font-medium">
            {latestMessage && latestMessage.text}
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * 
return (
            <Link href={path} key={convo.peerAddress}>
              <a
                className={classNames(
                  isCurrentPath
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                )}
              >
                <InboxInIcon
                  className={classNames(
                    isCurrentPath
                      ? 'text-gray-500'
                      : 'text-gray-400 group-hover:text-gray-500',
                    'mr-3 flex-shrink-0 h-6 w-6'
                  )}
                  aria-hidden="true"
                />
                <Address address={convo.peerAddress} />
              </a>
            </Link>
          )
        })
 * @returns 
 */

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
