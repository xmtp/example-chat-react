import { createContext } from 'react'
import { Conversation } from '@xmtp/xmtp-js/dist/types/src/conversations'
type ConversationsListProps = {
  conversations: Conversation[]
}

export type BooleanLogic = { id: string; name: string }
export type ChainItem = { id: string; name: string }
export type ConditionItem = {
  id: string
  contractType: string
  contractAddress: string
  tokenId: string
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
  chainItem: ChainItem | undefined
  conditionItems: [ConditionItem] | []
  identity: Object | undefined
  setBooleanLogic: (val: BooleanLogic) => void
  setConditionItems: (val: ConditionItem) => void
  updateFilterBy: (val: string) => void
  updateCategoryBy: (val: string) => void
  updateIdentity: (val: any) => void
  setChainItem: (val: ChainItem) => void
  filterConversations: (val: string) => ConversationsListProps
  allLitValidateAddress: [string] | []
  setAllLitValidateAddress: (val: []) => undefined
}

export const CyberConnectContext = createContext<CyberConnectContextType>({
  filterBy: 'friends',
  booleanLogic: 'intersection',
  chainItem: { id: 'mumbai', name: 'mumbai' },
  conditionItems: [],
  identity: {},
  allLitValidateAddress: [],
  setAllLitValidateAddress: () => undefined,
  updateFilterBy: () => undefined,
  setBooleanLogic: () => undefined,
  setChainItem: () => undefined,
  setConditionItems: () => undefined,
  updateCategoryBy: () => undefined,
  updateIdentity: () => undefined,
  filterConversations: () => undefined,
})

export default CyberConnectContext
