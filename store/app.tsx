import { Client, Conversation, DecodedMessage } from '@xmtp/xmtp-js'
import { Signer } from 'ethers'
import create from 'zustand'

interface AppState {
  signer: Signer | undefined
  address: string | undefined
  setSigner: (signer: Signer | undefined) => void
  setAddress: (address: string | undefined) => void
  client: Client | undefined | null
  setClient: (client: Client | undefined | null) => void
  conversations: Map<string, Conversation>
  setConversations: (conversations: Map<string, Conversation>) => void
  loadingConversations: boolean
  setLoadingConversations: (loadingConversations: boolean) => void
  convoMessages: Map<string, DecodedMessage[]>
  setConvoMessages: (value: Map<string, DecodedMessage[]>) => void
}

export const useAppStore = create<AppState>((set) => ({
  signer: undefined,
  address: undefined,
  setSigner: (signer: Signer | undefined) => set(() => ({ signer })),
  setAddress: (address: string | undefined) => set(() => ({ address })),
  client: undefined,
  conversations: new Map(),
  loadingConversations: false,
  convoMessages: new Map(),
  setClient: (client: Client | undefined | null) => set(() => ({ client })),
  setConversations: (conversations: Map<string, Conversation>) =>
    set(() => ({ conversations })),
  setLoadingConversations: (loadingConversations: boolean) =>
    set(() => ({ loadingConversations })),
  setConvoMessages: (convoMessages: Map<string, DecodedMessage[]>) =>
    set(() => ({ convoMessages })),
}))
