import { Client, Conversation, Message } from '@xmtp/xmtp-js'
import { Signer } from 'ethers'
import create from 'zustand'

interface AppState {
  signer: Signer | undefined
  address: string | undefined
  setSigner: (signer: Signer) => void
  setAddress: (address: string) => void
  client: Client | undefined | null
  setClient: (client: Client | undefined | null) => void
  conversations: Map<string, Conversation> | null
  setConversations: (conversations: Map<string, Conversation>) => void
  loadingConversations: boolean
  setLoadingConversation: (loading: boolean) => void
  convoMessages: Map<string, Message[]>
  setConvoMessages: (value: Map<string, Message[]>) => void
}

export const useAppStore = create<AppState>((set) => ({
  signer: undefined,
  address: undefined,
  setSigner: (signer: Signer) => set(() => ({ signer })),
  setAddress: (address: string) => set(() => ({ address })),
  client: undefined,
  conversations: null,
  loadingConversations: false,
  convoMessages: new Map(),
  setClient: (client: Client | undefined | null) => set(() => ({ client })),
  setConversations: (conversations: Map<string, Conversation>) =>
    set(() => ({ conversations })),
  setLoadingConversation: (loading: boolean) => set(() => ({ loading })),
  setConvoMessages: (convoMessages: Map<string, Message[]>) =>
    set(() => ({ convoMessages })),
}))
