import { createContext } from 'react'
import { Conversation } from '@xmtp/xmtp-js/dist/types/src/conversations'
type ConversationsListProps = {
  conversations: Conversation[]
}

export type BooleanLogic = { id: string; name: string }

export type ConditionItem = {
  id: string
  contractType: string
  contractAddress: string
  comparator: string
  number: number
}

export const booleanLogicItems = [
  { id: 'intersection', name: 'intersection' },
  { id: 'union', name: 'union' },
]

export type CyberConnectContextType = {
  filterBy: string | undefined
  booleanLogic: BooleanLogic | undefined
  conditionItems: [ConditionItem] | []
  categoryBy: string | undefined
  identity: Object | undefined
  updateFilterBy: (val: string) => void
  updateCategoryBy: (val: string) => void
  updateIdentity: (val: any) => void
  filterConversations: (val: string) => ConversationsListProps
}

export const CyberConnectContext = createContext<CyberConnectContextType>({
  filterBy: 'Friends',
  booleanLogic: 'intersection',
  conditionItems: [],
  categoryBy: 'All',
  identity: {},
  updateFilterBy: () => undefined,
  setBooleanLogic: () => undefined,
  setConditionItems: () => undefined,
  updateCategoryBy: () => undefined,
  updateIdentity: () => undefined,
  filterConversations: () => undefined,
})

export default CyberConnectContext
