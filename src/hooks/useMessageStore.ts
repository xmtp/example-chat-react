import type { Message } from '@xmtp/xmtp-js'
import { useReducer } from 'react'

type MessageStoreEvent = {
  peerAddress: string
  messages: Message[]
}

type MessageStore = { [address: string]: Message[] }

const useMessageStore = () => {
  const [messageStore, dispatchMessages] = useReducer(
    (state: MessageStore, { peerAddress, messages }: MessageStoreEvent) => ({
      ...state,
      [peerAddress]: [...(state[peerAddress] || []), ...(messages || [])],
    }),
    {}
  )

  return {
    messageStore,
    dispatchMessages,
  }
}

export default useMessageStore
