import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { Client } from '@xmtp/xmtp-js'
import { Signer } from 'ethers'
import { Conversation } from '@xmtp/xmtp-js/dist/types/src/conversations'

type XmtpContextType = {
  wallet: Signer | undefined
  walletAddress: string | undefined
  client: Client | undefined
  conversations: Conversation[]
  connect: (wallet: Signer) => void
  disconnect: () => void
}

export const XmtpContext = createContext<XmtpContextType>({
  wallet: undefined,
  walletAddress: undefined,
  client: undefined,
  conversations: [],
  connect: () => undefined,
  disconnect: () => undefined,
})

export const useXmtp = (): XmtpContextType => {
  const context = useContext(XmtpContext)
  if (context === undefined) {
    throw new Error('useXmtp must be used within an XmtpProvider')
  }
  return context
}

export const XmtpProvider: React.FC = ({ children }) => {
  const [wallet, setWallet] = useState<Signer>()
  const [walletAddress, setWalletAddress] = useState<string>()
  const [client, setClient] = useState<Client>()
  const [conversations, dispatchConversations] = useReducer(
    (state: Conversation[], newConvos: Conversation[] | undefined) => {
      if (newConvos === undefined) {
        return []
      }
      newConvos = newConvos.filter(
        (convo) =>
          state.findIndex((otherConvo) => {
            return convo.peerAddress === otherConvo.peerAddress
          }) < 0 && convo.peerAddress != client?.address
      )
      return newConvos === undefined ? [] : state.concat(newConvos)
    },
    []
  )

  const connect = useCallback(
    async (wallet: Signer) => {
      setWallet(wallet)
      const walletAddr = await wallet.getAddress()
      setWalletAddress(walletAddr)
    },
    [setWallet, setWalletAddress]
  )

  const disconnect = useCallback(async () => {
    setWallet(undefined)
    setWalletAddress(undefined)
    dispatchConversations(undefined)
  }, [setWallet, setWalletAddress, dispatchConversations])

  useEffect(() => {
    const initClient = async () => {
      if (!wallet) return
      setClient(await Client.create(wallet))
    }
    initClient()
  }, [wallet])

  useEffect(() => {
    const listConversations = async () => {
      if (!client) return
      const convos = await client.conversations.list()
      convos.forEach((convo: Conversation) => {
        dispatchConversations([convo])
      })
    }
    listConversations()
  }, [client, walletAddress])

  useEffect(() => {
    const streamConversations = async () => {
      if (!client) return
      const stream = client.conversations.stream()
      for await (const convo of stream) {
        dispatchConversations([convo])
      }
    }
    streamConversations()
  }, [client, walletAddress])

  const [providerState, setProviderState] = useState<XmtpContextType>({
    wallet,
    walletAddress,
    client,
    conversations,
    connect,
    disconnect,
  })

  useEffect(() => {
    setProviderState({
      wallet,
      walletAddress,
      client,
      conversations,
      connect,
      disconnect,
    })
  }, [wallet, walletAddress, client, conversations, connect, disconnect])

  return (
    <XmtpContext.Provider value={providerState}>
      {children}
    </XmtpContext.Provider>
  )
}

export default XmtpContext
