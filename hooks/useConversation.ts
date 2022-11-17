import { Conversation, DecodedMessage, Stream } from '@xmtp/xmtp-js'
import { useState, useEffect } from 'react'
import {
  checkIfPathIsEns,
  getConversationKey,
  shortAddress,
  truncate,
} from '../helpers'
import { useAppStore } from '../store/app'
import useWalletProvider from './useWalletProvider'

type OnMessageCallback = () => void

let stream: Stream<DecodedMessage>
let latestMsgId: string

const useConversation = (
  peerAddress: string,
  onMessageCallback?: OnMessageCallback
) => {
  const { lookupAddress } = useWalletProvider()
  const walletAddress = useAppStore((state) => state.address)
  const client = useAppStore((state) => state.client)
  const convoMessages = useAppStore((state) => state.convoMessages)
  const addMessages = useAppStore((state) => state.addMessages)
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [loading] = useState<boolean>(false)
  const [browserVisible, setBrowserVisible] = useState<boolean>(true)

  useEffect(() => {
    window.addEventListener('focus', () => setBrowserVisible(true))
    window.addEventListener('blur', () => setBrowserVisible(false))
  }, [])

  useEffect(() => {
    const getConvo = async () => {
      if (!client || !peerAddress || checkIfPathIsEns(peerAddress)) {
        return
      }
      setConversation(await client.conversations.newConversation(peerAddress))
    }
    getConvo()
  }, [client, peerAddress])

  useEffect(() => {
    if (!conversation) {
      return
    }
    const streamMessages = async () => {
      stream = await conversation.streamMessages()
      for await (const msg of stream) {
        const numAdded = addMessages(getConversationKey(conversation), [msg])
        if (numAdded > 0) {
          const newMessages =
            convoMessages.get(getConversationKey(conversation)) ?? []
          newMessages.push(msg)
          const uniqueMessages = [
            ...Array.from(
              new Map(newMessages.map((item) => [item['id'], item])).values()
            ),
          ]
          convoMessages.set(getConversationKey(conversation), uniqueMessages)
          if (
            latestMsgId !== msg.id &&
            Notification.permission === 'granted' &&
            msg.senderAddress !== walletAddress &&
            !browserVisible
          ) {
            const name = await lookupAddress(msg.senderAddress ?? '')
            new Notification('XMTP', {
              body: `${
                name || shortAddress(msg.senderAddress ?? '')
              }\n${truncate(msg.content, 75)}`,
            })

            latestMsgId = msg.id
          }
        }
        if (onMessageCallback) {
          onMessageCallback()
        }
      }
    }
    streamMessages()
    return () => {
      const closeStream = async () => {
        if (!stream) {
          return
        }
        await stream.return()
      }
      closeStream()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    browserVisible,
    conversation,
    convoMessages,
    lookupAddress,
    onMessageCallback,
    walletAddress,
  ])

  const handleSend = async (message: string) => {
    if (!conversation) {
      return
    }
    await conversation.send(message)
  }

  return {
    loading,
    sendMessage: handleSend,
  }
}

export default useConversation
