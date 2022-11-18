import { Conversation, DecodedMessage, Stream } from '@xmtp/xmtp-js'
import { useState, useEffect } from 'react'
import { getConversationKey, shortAddress, truncate } from '../helpers'
import { useAppStore } from '../store/app'
import useWalletProvider from './useWalletProvider'

let stream: Stream<DecodedMessage>
let latestMsgId: string

const useConversation = (selectedConversation?: Conversation) => {
  const { lookupAddress } = useWalletProvider()
  const walletAddress = useAppStore((state) => state.address)
  const convoMessages = useAppStore((state) => state.convoMessages)
  const addMessages = useAppStore((state) => state.addMessages)
  const [loading] = useState<boolean>(false)
  const [browserVisible, setBrowserVisible] = useState<boolean>(true)

  useEffect(() => {
    window.addEventListener('focus', () => setBrowserVisible(true))
    window.addEventListener('blur', () => setBrowserVisible(false))
  }, [])

  useEffect(() => {
    if (!selectedConversation) {
      return
    }
    const streamMessages = async () => {
      stream = await selectedConversation.streamMessages()
      for await (const msg of stream) {
        const numAdded = addMessages(getConversationKey(selectedConversation), [
          msg,
        ])
        if (numAdded > 0) {
          const newMessages =
            convoMessages.get(getConversationKey(selectedConversation)) ?? []
          newMessages.push(msg)
          const uniqueMessages = [
            ...Array.from(
              new Map(newMessages.map((item) => [item['id'], item])).values()
            ),
          ]
          convoMessages.set(
            getConversationKey(selectedConversation),
            uniqueMessages
          )
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
    selectedConversation,
    convoMessages,
    lookupAddress,
    walletAddress,
  ])

  const handleSend = async (message: string) => {
    if (!selectedConversation) {
      return
    }
    await selectedConversation.send(message)
  }

  return {
    loading,
    sendMessage: handleSend,
  }
}

export default useConversation
