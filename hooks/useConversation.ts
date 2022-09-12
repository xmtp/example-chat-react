import { Conversation, Message, Stream } from '@xmtp/xmtp-js'
import { useState, useEffect, useContext } from 'react'
import { WalletContext } from '../contexts/wallet'
import XmtpContext from '../contexts/xmtp'
import { checkIfPathIsEns } from '../helpers'
import useMessageStore from './useMessageStore'

type OnMessageCallback = () => void

let stream: Stream<Message>
let latestMsgId: string

const useConversation = (
  peerAddress: string,
  onMessageCallback?: OnMessageCallback
) => {
  const { client } = useContext(XmtpContext)
  const { address: walletAddress } = useContext(WalletContext)
  const { messageStore, dispatchMessages } = useMessageStore()
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

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
    const listMessages = async () => {
      setLoading(true)
      const msgs = await conversation.messages()
      if (
        messageStore &&
        msgs.length !== messageStore[conversation.peerAddress]?.length
      ) {
        console.log(
          'Listing messages for peer address',
          conversation.peerAddress
        )
        if (dispatchMessages) {
          await dispatchMessages({
            peerAddress: conversation.peerAddress,
            messages: msgs,
          })
        }
        if (onMessageCallback) {
          onMessageCallback()
        }
      }
      setLoading(false)
    }
    listMessages()
  }, [conversation])

  useEffect(() => {
    if (!conversation) return
    const streamMessages = async () => {
      stream = await conversation.streamMessages()
      for await (const msg of stream) {
        if (dispatchMessages) {
          dispatchMessages({
            peerAddress: conversation.peerAddress,
            messages: [msg],
          })
        }
        if (latestMsgId !== msg.id) {
          if (Notification.permission === 'granted') {
            if (msg.senderAddress === walletAddress) {
              new Notification('New Message On XMTP', {
                body: `From ${msg.senderAddress}`,
                icon: '/xmtp-icon.png',
              })
            }
          }
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
  }, [conversation])

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
