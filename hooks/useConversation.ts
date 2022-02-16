import { Conversation, Message, Stream } from '@xmtp/xmtp-js'
import { useContext, useCallback, useState, useReducer, useEffect } from 'react'
import { XmtpContext } from '../components/XmtpContext'

type MessageDeduper = (message: Message) => boolean
const buildMessageDeduper = (state: Message[]): MessageDeduper => {
  const existingMessageKeys = state.map((msg) => msg.id)

  return (msg: Message) => existingMessageKeys.indexOf(msg.id) === -1
}

type OnMessageCallback = () => void

const useConversation = (
  peerAddress: string,
  onMessageCallback?: OnMessageCallback
) => {
  const { client } = useContext(XmtpContext)
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [stream, setStream] = useState<Stream<Message>>()
  useEffect(() => {
    const getConvo = async () => {
      if (!client) {
        return
      }
      setConversation(await client.conversations.newConversation(peerAddress))
    }
    getConvo()
  }, [client, peerAddress])

  const [messages, dispatchMessages] = useReducer(
    (state: Message[], newMessages: Message[] | undefined) => {
      // clear out messages when given undefined
      return newMessages === undefined
        ? []
        : state.concat(newMessages.filter(buildMessageDeduper(state)))
    },
    []
  )

  useEffect(() => {
    dispatchMessages(undefined)
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
      const msgs = await conversation.messages()
      dispatchMessages(msgs)
      if (onMessageCallback) {
        onMessageCallback()
      }
    }
    listMessages()
  }, [conversation, onMessageCallback])

  useEffect(() => {
    const streamMessages = async () => {
      if (!conversation) return
      const stream = conversation.streamMessages()
      setStream(stream)
      for await (const msg of stream) {
        dispatchMessages([msg])
        if (onMessageCallback) {
          onMessageCallback()
        }
      }
    }
    streamMessages()
  }, [conversation, onMessageCallback])

  const handleSend = useCallback(
    async (message: string) => {
      if (!conversation) return
      await conversation.send(message)
    },
    [conversation]
  )

  return {
    conversation,
    messages,
    sendMessage: handleSend,
  }
}

export default useConversation
