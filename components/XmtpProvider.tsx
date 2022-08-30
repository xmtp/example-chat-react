import { useContext, useEffect, useReducer, useState } from 'react'
import { Conversation } from '@xmtp/xmtp-js'
import { Client } from '@xmtp/xmtp-js'
import { Signer } from 'ethers'
import { getEnv } from '../helpers'
import { XmtpContext, XmtpContextType } from '../contexts/xmtp'
import { WalletContext } from '../contexts/wallet'

export const XmtpProvider: React.FC = ({ children }) => {
  const [client, setClient] = useState<Client>()
  const { signer } = useContext(WalletContext)
  const [loadingConversations, setLoadingConversations] =
    useState<boolean>(false)

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

  const initClient = async (wallet: Signer) => {
    if (!wallet) return
    setClient(await Client.create(wallet, { env: getEnv() }))
  }

  const disconnect = () => {
    setClient(undefined)
    dispatchConversations(undefined)
  }

  useEffect(() => {
    signer ? initClient(signer) : disconnect()
  }, [signer])

  useEffect(() => {
    if (!client) return

    const listConversations = async () => {
      console.log('Listing conversations')
      setLoadingConversations(true)
      const convos = await client.conversations.list()
      convos.forEach((convo: Conversation) => {
        dispatchConversations([convo])
      })
      setLoadingConversations(false)
    }
    listConversations()
  }, [client])

  const [providerState, setProviderState] = useState<XmtpContextType>({
    client,
    conversations,
    loadingConversations,
  })

  useEffect(() => {
    setProviderState({
      client,
      conversations,
      loadingConversations,
    })
  }, [client, conversations, loadingConversations])

  return (
    <XmtpContext.Provider value={providerState}>
      {children}
    </XmtpContext.Provider>
  )
}

export default XmtpProvider
