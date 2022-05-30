import { classNames, truncate, formatDate } from '../helpers'
import Link from 'next/link'
import Address from './Address'
import { useRouter } from 'next/router'
import { Conversation } from '@xmtp/xmtp-js/dist/types/src/conversations'
import useConversation from '../hooks/useConversation'
import { XmtpContext } from '../contexts/xmtp'
import { Message } from '@xmtp/xmtp-js'
import useWallet from '../hooks/useWallet'
import Avatar from './Avatar'
import { useContext, useEffect, useState } from 'react'
import CyberConnectContext from '../contexts/cyberConnect'
import { intersection, get, without } from 'lodash'

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
}: ConversationTileProps): JSX.Element | null => {
  const { lookupAddress } = useWallet()
  const { messages } = useConversation(conversation.peerAddress)
  const latestMessage = getLatestMessage(messages)
  const path = `/dm/${conversation.peerAddress}`
  if (!latestMessage) {
    return null
  }
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
          <div className="w-full py-4 sm:text-left text">
            <div className="grid grid-cols-2">
              <Address
                address={conversation.peerAddress}
                className="text-lg font-bold text-black md:text-md place-self-start"
                lookupAddress={lookupAddress}
              />
              <span
                className={classNames(
                  'text-lg md:text-sm font-normal place-self-end',
                  isSelected ? 'text-n-500' : 'text-n-300'
                )}
              >
                {formatDate(latestMessage?.sent)}
              </span>
            </div>
            <p
              className={classNames(
                'text-[13px] md:text-sm font-normal text-ellipsis mt-0',
                isSelected ? 'text-n-500' : 'text-n-300'
              )}
            >
              {latestMessage && truncate(latestMessage.content, 75)}
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
  const { getMessages } = useContext(XmtpContext)
  const { filterBy, conditionItems, allLitValidateAddress, identity } =
    useContext(CyberConnectContext)
  const orderByLatestMessage = (
    convoA: Conversation,
    convoB: Conversation
  ): number => {
    const convoAMessages = getMessages(convoA.peerAddress)
    const convoBMessages = getMessages(convoB.peerAddress)
    const convoALastMessageDate =
      getLatestMessage(convoAMessages)?.sent || new Date()
    const convoBLastMessageDate =
      getLatestMessage(convoBMessages)?.sent || new Date()
    return convoALastMessageDate < convoBLastMessageDate ? 1 : -1
  }

  const [filterdConversations, setFilteredConversations] =
    useState<ConversationsListProps>()

  useEffect(() => {
    const doFilter = (conversations) => {
      const litAddressArr = allLitValidateAddress.map((address) =>
        address.toString().toLowerCase()
      )
      if (filterBy === 'all' || filterBy === undefined) {
        if (conditionItems.length === 0) {
          return conversations
        }
        return conversations.filter((item) => {
          const address = item.peerAddress.toString().toLowerCase()
          return litAddressArr.includes(address)
        })
      }

      const getAddress = (thePath) => {
        return get(identity, thePath, []).map(({ address }) => {
          return address.toString().toLowerCase()
        })
      }
      const friends = getAddress('friends.list')
      const followers = getAddress('followers.list')
      const followings = getAddress('followings.list')
      const relationMap = {
        friends,
        followers: without(followers, ...friends),
        followings: without(followings, ...friends),
      }

      let list = relationMap[filterBy]
      if (conditionItems.length > 0) {
        list = intersection(list, litAddressArr)
      }

      return conversations.filter((item) => {
        const address = item.peerAddress.toString().toLowerCase()
        return list.includes(address)
      })
    }
    setFilteredConversations(doFilter(conversations))
  }, [filterBy, identity, conversations, conditionItems, allLitValidateAddress])

  return (
    <div>
      {filterdConversations &&
        filterdConversations.sort(orderByLatestMessage).map((convo) => {
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
