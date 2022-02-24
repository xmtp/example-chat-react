import { Conversation, Message, Stream } from '@xmtp/xmtp-js'
import { useContext, useCallback, useState, useEffect } from 'react'
import { XmtpContext } from '../contexts/xmtp'

type OnMessageCallback = () => void

const useConversation = (
  peerAddress: string,
  onMessageCallback?: OnMessageCallback
) => {
  const { client, getMessages, dispatchMessages } = useContext(XmtpContext)
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [stream, setStream] = useState<Stream<Message>>()
  const [loading, setLoading] = useState<boolean>(false)
  useEffect(() => {
    const getConvo = async () => {
      if (!client) {
        return
      }
      setConversation(await client.conversations.newConversation(peerAddress))
    }
    getConvo()
  }, [client, peerAddress])

  useEffect(() => {
    const closeStream = async () => {
      if (!stream) return
      await stream.return()
    }
    closeStream()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peerAddress])

  useEffect(() => {
    const listMessages = async () => {
      if (!conversation) return
      console.log('Listing messages for peer address', conversation.peerAddress)
      setLoading(true)
      const msgs = await conversation.messages({ pageSize: 100 })
      if (dispatchMessages) {
        dispatchMessages({
          peerAddress: conversation.peerAddress,
          messages: msgs,
        })
      }

      if (onMessageCallback) {
        onMessageCallback()
      }
      setLoading(false)
    }
    listMessages()
  }, [conversation, dispatchMessages, onMessageCallback, setLoading])

  useEffect(() => {
    const streamMessages = async () => {
      if (!conversation) return
      const stream = conversation.streamMessages()
      setStream(stream)
      for await (const msg of stream) {
        if (dispatchMessages) {
          dispatchMessages({
            peerAddress: conversation.peerAddress,
            messages: [msg],
          })
        }

        if (onMessageCallback) {
          onMessageCallback()
        }
      }
    }
    streamMessages()
  }, [conversation, peerAddress, dispatchMessages, onMessageCallback])

  const handleSend = useCallback(
    async (message: string) => {
      if (!conversation) return
      await conversation.send(message)
    },
    [conversation]
  )

  return {
    conversation,
    loading,
    messages: getMessages(peerAddress),
    sendMessage: handleSend,
  }
}

export default useConversation
