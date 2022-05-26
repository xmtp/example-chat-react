import { createContext } from 'react'
import { Conversation } from '@xmtp/xmtp-js/dist/types/src/conversations'
type ConversationsListProps = {
  conversations: Conversation[]
}

export type CyberConnectContextType = {
  filterBy: string | undefined
  categoryBy: string | undefined
  identity: Object | undefined
  updateFilterBy: (val: string) => void
  updateCategoryBy: (val: string) => void
  updateIdentity: (val: any) => void
  filterConversations: (val: string) => ConversationsListProps
}

export const CyberConnectContext = createContext<CyberConnectContextType>({
  filterBy: 'Friends',
  categoryBy: 'All',
  identity: {},
  updateFilterBy: () => undefined,
  updateCategoryBy: () => undefined,
  updateIdentity: () => undefined,
  filterConversations: () => undefined,
})

export default CyberConnectContext
