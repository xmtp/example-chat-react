import { Conversation } from '@xmtp/xmtp-js'
import { NextRouter } from 'next/router'

export const truncate = (
  str: string | undefined,
  length: number
): string | undefined => {
  if (!str) {
    return str
  }
  if (str.length > length) {
    return `${str.substring(0, length - 3)}...`
  }
  return str
}

export const formatDate = (d: Date | undefined): string =>
  d ? d.toLocaleDateString('en-US') : ''

export const formatTime = (d: Date | undefined): string =>
  d
    ? d.toLocaleTimeString(undefined, {
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
      })
    : ''

export const checkPath = () => {
  return window.location.pathname !== '/' && window.location.pathname !== '/dm'
}

export const isEns = (address: string): boolean => {
  return address.endsWith('eth') || address.endsWith('.cb.id')
}

export const is0xAddress = (address: string): boolean =>
  address.startsWith('0x') && address.length === 42

export const shortAddress = (addr: string): string =>
  addr.length > 10 && addr.startsWith('0x')
    ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
    : addr

export const getConversationKey = (conversation?: Conversation): string => {
  return conversation?.context?.conversationId
    ? `${conversation?.peerAddress}/${conversation?.context?.conversationId}`
    : conversation?.peerAddress ?? ''
}

export const getAddressFromPath = (router: NextRouter): string => {
  return Array.isArray(router.query.recipientWalletAddr)
    ? router.query.recipientWalletAddr[0]
    : (router.query.recipientWalletAddr as string)
}
