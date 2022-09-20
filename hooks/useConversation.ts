import { Conversation, Message, Stream } from '@xmtp/xmtp-js'
import { useState, useEffect, useContext } from 'react'
import { WalletContext } from '../contexts/wallet'
import XmtpContext from '../contexts/xmtp'
import { checkIfPathIsEns, shortAddress } from '../helpers'
import useMessageStore from './useMessageStore'

type OnMessageCallback = () => void

let stream: Stream<Message>
let latestMsgId: string

const useConversation = (
  peerAddress: string,
  onMessageCallback?: OnMessageCallback
) => {
  const { address: walletAddress, lookupAddress } = useContext(WalletContext)
  const { client, convoMessages } = useContext(XmtpContext)
  const { messageStore, dispatchMessages } = useMessageStore()
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
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
  }, [peerAddress])

  useEffect(() => {
    if (!conversation) return
    const listMessages = () => {
      setLoading(true)
      if (dispatchMessages) {
        dispatchMessages({
          peerAddress: conversation.peerAddress,
          messages: convoMessages.get(conversation.peerAddress) ?? [],
        })
      }
      if (onMessageCallback) {
        onMessageCallback()
      }
      setLoading(false)
    }
    listMessages()
  }, [conversation, convoMessages])

  useEffect(() => {
    if (!conversation) return
    const streamMessages = async () => {
      stream = await conversation.streamMessages()
      for await (const msg of stream) {
        if (dispatchMessages) {
          await dispatchMessages({
            peerAddress: conversation.peerAddress,
            messages: [msg],
          })
        }
        if (
          latestMsgId !== msg.id &&
          Notification.permission === 'granted' &&
          msg.senderAddress !== walletAddress &&
          !browserVisible
        ) {
          const name = await lookupAddress(msg.senderAddress ?? '')
          new Notification('XMTP', {
            body: `From ${name || shortAddress(msg.senderAddress ?? '')}`,
            icon: '/xmtp-icon.png',
          })

          latestMsgId = msg.id
        }
        if (onMessageCallback) {
          onMessageCallback()
        }
      }
    }
    streamMessages()
    return () => {
      const closeStream = async () => {
        if (!stream) return
        await stream.return()
      }
      closeStream()
    }
  }, [
    browserVisible,
    conversation,
    dispatchMessages,
    onMessageCallback,
    walletAddress,
  ])

  const handleSend = async (message: string) => {
    if (!conversation) return
    await conversation.send(message)
  }

  return {
    loading,
    messages: messageStore[peerAddress] ?? [],
    sendMessage: handleSend,
  }
}

export default useConversation
