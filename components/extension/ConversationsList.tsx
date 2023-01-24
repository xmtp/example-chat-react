import { Conversation } from '@xmtp/xmtp-js'
import { useEffect } from 'react'
import { classNames, formatDate, getConversationKey } from '../../helpers'
import useNotificationSubscription from '../../hooks/useNotificationSubscription'
import useWalletProvider from '../../hooks/useWalletProvider'
import { useAppStore } from '../../store/app'
import Address from '../Address'
import Avatar from '../Avatar'
import { NoConversationsMessage } from '../NoConversationsMessage'

type ConversationTileProps = {
  conversation: Conversation
  isSelected: boolean
  onClick?: (conversation: Conversation) => void
}

export const ConversationTile = ({
  conversation,
  isSelected,
  onClick,
}: ConversationTileProps): JSX.Element | null => {
  const address = useAppStore((state) => state.address)
  const previewMessages = useAppStore((state) => state.previewMessages)
  const loadingConversations = useAppStore(
    (state) => state.loadingConversations
  )
  const setActiveConversation = useAppStore((state) => state.setActiveRecipient)

  if (!previewMessages.get(getConversationKey(conversation))) {
    return null
  }

  const latestMessage = previewMessages.get(getConversationKey(conversation))

  const conversationDomain =
    conversation.context?.conversationId.split('/')[0] ?? ''

  if (!latestMessage) {
    return null
  }

  const handleClick = (conversation: Conversation) => {
    setActiveConversation(conversation.peerAddress)
    onClick?.(conversation)
  }

  return (
    <div
      onClick={() => handleClick(conversation)}
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
        'cursor-pointer',
        loadingConversations ? 'opacity-80' : 'opacity-100',
        isSelected ? 'bg-bt-200' : null
      )}
    >
      <Avatar peerAddress={conversation.peerAddress} />
      <div className="py-4 sm:text-left text w-full">
        {conversationDomain && (
          <div className="text-sm rounded-2xl text-white bg-black w-max px-2 font-bold">
            {conversationDomain.toLocaleUpperCase()}
          </div>
        )}
        <div className="grid-cols-2 grid">
          <Address
            address={conversation.peerAddress}
            className="text-black text-lg md:text-md font-bold place-self-start"
          />
          <span
            className={classNames(
              'text-lg md:text-sm font-normal place-self-end',
              isSelected ? 'text-n-500' : 'text-n-300',
              loadingConversations ? 'animate-pulse' : ''
            )}
          >
            {formatDate(latestMessage?.sent)}
          </span>
        </div>
        <span className="text-sm text-gray-500 line-clamp-1 break-all">
          {address === latestMessage?.senderAddress && 'You: '}{' '}
          {latestMessage?.content}
        </span>
      </div>
    </div>
  )
}

const ConversationsList = () => {
  const activeConversation = useAppStore((state) => state.activeConversation)
  const conversations = useAppStore((state) => state.conversations)
  const previewMessages = useAppStore((state) => state.previewMessages)
  const setExtensionAppViewState = useAppStore(
    (state) => state.setExtensionAppViewState
  )
  const { register: registerPushNotifications } = useNotificationSubscription()

  const orderByLatestMessage = (
    convoA: Conversation,
    convoB: Conversation
  ): number => {
    const convoALastMessageDate =
      previewMessages.get(getConversationKey(convoA))?.sent || new Date()
    const convoBLastMessageDate =
      previewMessages.get(getConversationKey(convoB))?.sent || new Date()
    return convoALastMessageDate < convoBLastMessageDate ? 1 : -1
  }

  const handleClickedConversation = (peerAddress: string) => {
    console.log('clicked convo', peerAddress)

    setExtensionAppViewState('conversation')
  }

  // This was a hack to reload the eth name info if the conversation changed
  // TODO: Do we need this?
  // useEffect(() => {
  //   extensionViewState === 'conversation' &&
  //     reloadIfQueryParamPresent(activeRecipient)
  // }, [activeRecipient, reloadIfQueryParamPresent, extensionViewState])

  useEffect(() => {
    if (conversations && conversations.size > 0) {
      registerPushNotifications()
    }
  }, [conversations, registerPushNotifications])

  if (!conversations || conversations.size == 0) {
    return <NoConversationsMessage />
  }

  return (
    <>
      {conversations &&
        conversations.size > 0 &&
        Array.from(conversations.values())
          .sort(orderByLatestMessage)
          .map((convo) => (
            <ConversationTile
              key={convo.peerAddress}
              conversation={convo}
              isSelected={activeConversation === convo.peerAddress}
              onClick={handleClickedConversation.bind(null, convo.peerAddress)}
            />
          ))}
    </>
  )
}

export default ConversationsList
