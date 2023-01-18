import { Client, Conversation, DecodedMessage } from '@xmtp/xmtp-js'
import { Signer } from 'ethers'
import create from 'zustand'
import getUniqueMessages from '../helpers/getUniqueMessages'
import Web3Modal from 'web3modal'

// Used to keep track of the current view state of the extension app
// The extension doesn't have access to next/router, so captures
// the state otherwise handled by the router.
type ExtensionAppViewState = 'dm' | 'home' | 'conversation'

interface AppState {
  web3Modal: Web3Modal | undefined
  setWeb3Modal: (signer: Web3Modal | undefined) => void
  signer: Signer | undefined
  activeRecipient: string | undefined
  setSigner: (signer: Signer | undefined) => void
  address: string | undefined
  setAddress: (address: string | undefined) => void
  client: Client | undefined | null
  setClient: (client: Client | undefined | null) => void
  conversations: Map<string, Conversation>
  activeConversation: string
  setConversations: (conversations: Map<string, Conversation>) => void
  setActiveConversation: (value: string) => void
  loadingConversations: boolean
  setLoadingConversations: (loadingConversations: boolean) => void
  convoMessages: Map<string, DecodedMessage[]>
  previewMessages: Map<string, DecodedMessage>
  setPreviewMessage: (key: string, message: DecodedMessage) => void
  setPreviewMessages: (previewMessages: Map<string, DecodedMessage>) => void
  addMessages: (key: string, newMessages: DecodedMessage[]) => number
  reset: () => void
  extensionAppViewState: ExtensionAppViewState
  setExtensionAppViewState: (value: ExtensionAppViewState) => void
  setActiveRecipient: (value: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  web3Modal: undefined,
  setWeb3Modal: (web3Modal: Web3Modal | undefined) =>
    set(() => ({ web3Modal })),
  signer: undefined,
  setSigner: (signer: Signer | undefined) => set(() => ({ signer })),
  address: undefined,
  setAddress: (address: string | undefined) => set(() => ({ address })),
  client: undefined,
  setClient: (client: Client | undefined | null) => set(() => ({ client })),
  conversations: new Map(),
  setConversations: (conversations: Map<string, Conversation>) =>
    set(() => ({ conversations })),
  loadingConversations: false,
  setLoadingConversations: (loadingConversations: boolean) =>
    set(() => ({ loadingConversations })),
  convoMessages: new Map(),
  previewMessages: new Map(),
  setPreviewMessage: (key: string, message: DecodedMessage) =>
    set((state) => {
      const newPreviewMessages = new Map(state.previewMessages)
      newPreviewMessages.set(key, message)
      return { previewMessages: newPreviewMessages }
    }),
  setPreviewMessages: (previewMessages) => set(() => ({ previewMessages })),
  addMessages: (key: string, newMessages: DecodedMessage[]) => {
    let numAdded = 0
    set((state) => {
      const convoMessages = new Map(state.convoMessages)
      const existing = state.convoMessages.get(key) || []
      const updated = getUniqueMessages([...existing, ...newMessages])
      numAdded = updated.length - existing.length
      // If nothing has been added, return the old item to avoid unnecessary refresh
      if (!numAdded) {
        return { convoMessages: state.convoMessages }
      }
      convoMessages.set(key, updated)
      return { convoMessages }
    })
    return numAdded
  },
  reset: () =>
    set(() => {
      return {
        client: undefined,
        conversations: new Map(),
        convoMessages: new Map(),
        previewMessages: new Map(),
        address: undefined,
        signer: undefined,
      }
    }),
  extensionAppViewState: 'home',
  setExtensionAppViewState: (value: ExtensionAppViewState) =>
    set(() => ({ extensionAppViewState: value })),
  setActiveConversation: (value: string) =>
    set(() => ({ activeConversation: value })),
  setActiveRecipient: (value: string) =>
    set(() => ({ activeRecipient: value })),
  activeRecipient: undefined,
  activeConversation: undefined,
}))

// export const persistedStore = create(
//   persist<AppState>(
//     (set, get) => ({
//       signer: get()?.signer,
//       extensionAppViewState: 'home',
//       activeConversation: get()?.activeConversation,
//       setExtensionAppViewState: (value: ExtensionAppViewState) =>
//         set(() => ({ extensionAppViewState: value })),
//       setSigner: (signer: Signer | undefined) => set(() => ({ signer })),
//       address: undefined,
//       setAddress: (address: string | undefined) => set(() => ({ address })),
//       client: undefined,
//       setClient: (client: Client | undefined | null) => set(() => ({ client })),
//       conversations: new Map(),
//       setConversations: (conversations: Map<string, Conversation>) =>
//         set(() => ({ conversations })),
//       setActiveConversation: (value: string) =>
//         set(() => ({ activeConversation: value })),
//       loadingConversations: false,
//       setLoadingConversations: (loadingConversations: boolean) =>
//         set(() => ({ loadingConversations })),
//       convoMessages: new Map(),
//       setConvoMessages: (convoMessages: Map<string, DecodedMessage[]>) =>
//         set(() => ({ convoMessages })),
//       setActiveRecipient: (value: string) =>
//         set(() => ({ activeRecipient: value })),
//       activeRecipient: get()?.activeRecipient,
//     }),
//     {
//       name: 'xmtp-extension',
//       getStorage: () => localStorage,
//       deserialize: (str) => {
//         console.log('deserialize', str)
//         return JSON.parse(str)
//       },
//       serialize: (state) => {
//         console.log('serialize', state)
//         const { extensionAppViewState, activeConversation, activeRecipient } =
//           state.state
//         const stateToPersist = {
//           extensionAppViewState,
//           activeConversation,
//           activeRecipient,
//         }

//         return JSON.stringify(stateToPersist)
//       },
//     }
//   )
// )

// export const useAppStore = create(
//   persist<AppState>(
//     (set, get) => ({
//       signer: get()?.signer,
//       extensionAppViewState: 'home',
//       activeConversation: get()?.activeConversation,
//       setExtensionAppViewState: (value: ExtensionAppViewState) =>
//         set(() => ({ extensionAppViewState: value })),
//       setSigner: (signer: Signer | undefined) => set(() => ({ signer })),
//       address: undefined,
//       setAddress: (address: string | undefined) => set(() => ({ address })),
//       client: undefined,
//       setClient: (client: Client | undefined | null) => set(() => ({ client })),
//       conversations: new Map(),
//       setConversations: (conversations: Map<string, Conversation>) =>
//         set(() => ({ conversations })),
//       setActiveConversation: (value: string) =>
//         set(() => ({ activeConversation: value })),
//       loadingConversations: false,
//       setLoadingConversations: (loadingConversations: boolean) =>
//         set(() => ({ loadingConversations })),
//       convoMessages: new Map(),
//       setConvoMessages: (convoMessages: Map<string, DecodedMessage[]>) =>
//         set(() => ({ convoMessages })),
//       setActiveRecipient: (value: string) =>
//         set(() => ({ activeRecipient: value })),
//       activeRecipient: get()?.activeRecipient,
//     }),
//     {
//       name: 'xmtp-extension',
//       getStorage: () => localStorage,
//       deserialize: (str) => {
//         console.log('deserialize', str)
//         return JSON.parse(str)
//       },
//       serialize: (state) => {
//         console.log('serialize', state)
//         const { extensionAppViewState, activeConversation, activeRecipient } =
//           state.state
//         const stateToPersist = {
//           extensionAppViewState,
//           activeConversation,
//           activeRecipient,
//         }

//         return JSON.stringify(stateToPersist)
//       },
//     }
//   )
// )
