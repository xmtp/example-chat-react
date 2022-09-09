import { useCallback, useEffect, useReducer, useState } from 'react'
import { Conversation } from '@xmtp/xmtp-js'
import { Client } from '@xmtp/xmtp-js'
import { Signer } from 'ethers'
import { XmtpContext, XmtpContextType } from '../contexts/xmtp'

type XmtpProviderProps = {
  signer?: Signer
}

export const XmtpProvider: React.FC<XmtpProviderProps> = ({
  children,
  signer,
}) => {
  const [client, setClient] = useState<Client | null>()
  const [loadingConversations, setLoadingConversations] =
    useState<boolean>(false)

  const [conversations, dispatchConversations] = useReducer(
    (
      state: Map<string, Conversation>,
      newConvos: Conversation[] | undefined
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): any => {
      if (newConvos === undefined) {
        return null
      }
      newConvos.forEach((convo) => {
        if (convo.peerAddress !== client?.address) {
          if (state && !state.has(convo.peerAddress)) {
            state.set(convo.peerAddress, convo)
          } else if (state === null) {
            state = new Map()
            state.set(convo.peerAddress, convo)
          }
        }
      })
      return state ?? null
    },
    []
  )

  const initClient = useCallback(async (signer: Signer) => {
    if (!signer) return
    try {
      setClient(await Client.create(signer))
    } catch (e) {
      console.error(e)
      setClient(null)
    }
  }, [])

  const disconnect = () => {
    setClient(undefined)
    dispatchConversations(undefined)
  }

  useEffect(() => {
    signer ? initClient(signer) : disconnect()
  }, [initClient, signer])

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
    initClient,
  })

  useEffect(() => {
    setProviderState({
      client,
      conversations,
      loadingConversations,
      initClient,
    })
  }, [client, conversations, initClient, loadingConversations])

  return (
    <XmtpContext.Provider value={providerState}>
      {children}
    </XmtpContext.Provider>
  )
}

export default XmtpProvider
