import { Conversation, DecodedMessage, Stream } from '@xmtp/xmtp-js'
import { useEffect, useState } from 'react'
import { getConversationKey, shortAddress, truncate } from '../helpers'
import { useAppStore } from '../store/app'
import useWalletProvider from './useWalletProvider'

let latestMsgId: string

export const useListConversations = () => {
  const walletAddress = useAppStore((state) => state.address)
  const { lookupAddress } = useWalletProvider()
  const convoMessages = useAppStore((state) => state.convoMessages)
  const client = useAppStore((state) => state.client)
  const conversations = useAppStore((state) => state.conversations)
  const setConversations = useAppStore((state) => state.setConversations)
  const addMessages = useAppStore((state) => state.addMessages)
  const setPreviewMessage = useAppStore((state) => state.setPreviewMessage)
  const setLoadingConversations = useAppStore(
    (state) => state.setLoadingConversations
  )
  const [browserVisible, setBrowserVisible] = useState<boolean>(true)

  useEffect(() => {
    window.addEventListener('focus', () => setBrowserVisible(true))
    window.addEventListener('blur', () => setBrowserVisible(false))
  }, [])

  useEffect(() => {
    if (!client) {
      return
    }

    let messageStream: AsyncGenerator<DecodedMessage>
    let conversationStream: Stream<Conversation>

    const streamAllMessages = async () => {
      messageStream = await client.conversations.streamAllMessages()

      for await (const message of messageStream) {
        const key = getConversationKey(message.conversation)
        setPreviewMessage(key, message)

        const numAdded = addMessages(key, [message])
        if (numAdded > 0) {
          const newMessages = convoMessages.get(key) ?? []
          newMessages.push(message)
          const uniqueMessages = [
            ...Array.from(
              new Map(newMessages.map((item) => [item['id'], item])).values()
            ),
          ]
          convoMessages.set(key, uniqueMessages)
          if (
            latestMsgId !== message.id &&
            Notification.permission === 'granted' &&
            message.senderAddress !== walletAddress &&
            !browserVisible
          ) {
            const name = await lookupAddress(message.senderAddress ?? '')
            new Notification('XMTP', {
              body: `${
                name || shortAddress(message.senderAddress ?? '')
              }\n${truncate(message.content, 75)}`,
            })

            latestMsgId = message.id
          }
        }
      }
    }

    const listConversations = async () => {
      console.log('Listing conversations')
      setLoadingConversations(true)
      const convos = await client.conversations.list()

      Promise.all(
        convos.map(async (convo) => {
          if (convo.peerAddress !== walletAddress) {
            conversations.set(getConversationKey(convo), convo)
            setConversations(new Map(conversations))
          }
        })
      ).then(() => {
        setLoadingConversations(false)
        if (Notification.permission === 'default') {
          Notification.requestPermission()
        }
      })
    }
    const streamConversations = async () => {
      conversationStream = await client.conversations.stream()
      for await (const convo of conversationStream) {
        if (convo.peerAddress !== walletAddress) {
          conversations.set(getConversationKey(convo), convo)
          setConversations(new Map(conversations))
          closeMessageStream()
          streamAllMessages()
        }
      }
    }

    const closeConversationStream = async () => {
      if (!conversationStream) {
        return
      }
      await conversationStream.return()
    }

    const closeMessageStream = async () => {
      if (messageStream) {
        await messageStream.return(undefined)
      }
    }

    listConversations()
    streamConversations()
    streamAllMessages()

    return () => {
      closeConversationStream()
      closeMessageStream()
    }
  }, [client, walletAddress])
}

export default useListConversations
