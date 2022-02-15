import { classNames } from '../../helpers'
import Link from 'next/link'
import { InboxInIcon } from '@heroicons/react/outline'
import Address from '../Address'
import { useRouter } from 'next/router'
import { Conversation } from '@xmtp/xmtp-js'

type ConversationListProps = {
  conversations: Conversation[]
}

const ConversationsList = ({
  conversations,
}: ConversationListProps): JSX.Element => {
  const router = useRouter()

  return (
    <>
      {conversations &&
        conversations.map((convo) => {
          const path = `/dm/${convo.peerAddress}`
          const isCurrentPath = router.pathname == path
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
        })}
    </>
  )
}

export default ConversationsList
