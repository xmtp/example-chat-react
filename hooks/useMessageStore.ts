import { Message } from '@xmtp/xmtp-js'
import { useReducer } from 'react'
import { MessageStoreEvent } from '../contexts/xmtp'

type MessageStore = { [address: string]: Message[] }
type MessageDeduper = (message: Message) => boolean

const buildMessageDeduper = (state: Message[]): MessageDeduper => {
  const existingMessageKeys = state.map((msg) => msg.id)

  return (msg: Message) => existingMessageKeys.indexOf(msg.id) === -1
}

const useMessageStore = () => {
  const [messageStore, dispatchMessages] = useReducer(
    (state: MessageStore, { peerAddress, messages }: MessageStoreEvent) => {
      const existing = state[peerAddress] || []
      const newMessages = messages.filter(buildMessageDeduper(existing))

      if (!newMessages.length) {
        return state
      }

      console.log('Dispatching new messages for peer address', peerAddress)

      return {
        ...state,
        [peerAddress]: existing.concat(newMessages),
      }
    },
    {}
  )

  return {
    messageStore,
    dispatchMessages,
  }
}

export default useMessageStore
