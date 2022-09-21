import { Conversation, Message, Stream } from '@xmtp/xmtp-js'
import { useState, useEffect, useContext } from 'react'
import { WalletContext } from '../contexts/wallet'
import XmtpContext from '../contexts/xmtp'
import { checkIfPathIsEns, shortAddress } from '../helpers'

type OnMessageCallback = () => void

let stream: Stream<Message>
let latestMsgId: string

const useConversation = (
  peerAddress: string,
  onMessageCallback?: OnMessageCallback
) => {
  const { address: walletAddress, lookupAddress } = useContext(WalletContext)
  const { client, convoMessages, setConvoMessages } = useContext(XmtpContext)
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
    if (!conversation) return
    const streamMessages = async () => {
      stream = await conversation.streamMessages()
      for await (const msg of stream) {
        if (setConvoMessages) {
          const newMessages = convoMessages.get(conversation.peerAddress) ?? []
          newMessages.push(msg)
          const uniqueMessages = [
            ...Array.from(
              new Map(newMessages.map((item) => [item['id'], item])).values()
            ),
          ]
          convoMessages.set(conversation.peerAddress, uniqueMessages)
          setConvoMessages(new Map(convoMessages))
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
    convoMessages,
    lookupAddress,
    onMessageCallback,
    setConvoMessages,
    walletAddress,
  ])

  const handleSend = async (message: string) => {
    if (!conversation) return
    await conversation.send(message)
  }

  return {
    loading,
    sendMessage: handleSend,
  }
}

export default useConversation
